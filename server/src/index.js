import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import crypto from 'crypto';
import { sendOTP, sendWhatsAppText } from './utils/notifications.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ─── SUPABASE & OPENAI ───────────────────────────────────────────────────────
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
const origins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ origin: (o, cb) => (!o || origins.includes(o) ? cb(null, true) : cb(new Error('CORS'))) }));
app.use(express.json());
app.use(morgan('dev'));

// ─── RATE LIMITERS ───────────────────────────────────────────────────────────
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const aiLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });

// ─── AUTH MIDDLEWARE ─────────────────────────────────────────────────────────
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });
  req.user = user;
  next();
};

// Internal job secret guard
const jobAuth = (req, res, next) => {
  const secret = req.headers['x-internal-secret'];
  if (secret !== process.env.INTERNAL_SECRET) return res.status(403).json({ error: 'Forbidden' });
  next();
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const sendDiscordAlert = async (title, message, error = null) => {
  if (!process.env.DISCORD_WEBHOOK_URL) return;
  try {
    const embed = {
      title,
      description: message,
      color: 16711680, // Red
      fields: error ? [{ name: 'Error', value: error.toString().substring(0, 1024) }] : [],
      timestamp: new Date().toISOString()
    };
    await axios.post(process.env.DISCORD_WEBHOOK_URL, { embeds: [embed] });
  } catch (err) {
    console.error('[Discord] Failed to send alert', err.message);
  }
};

const sendWhatsApp = async (to, message) => {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) { console.warn('[WA] No creds'); return; }
  try {
    await axios.post(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'text',
      text: { body: message }
    }, { headers: { Authorization: `Bearer ${token}` } });
  } catch (err) {
    console.error('[WA send error]', err.response?.data || err.message);
    await sendDiscordAlert('WhatsApp Send Failure', `Failed to send message to ${to}`, err.response?.data ? JSON.stringify(err.response.data) : err.message);
    throw err;
  }
};

// ─── HEALTH ──────────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/health',     (_, res) => res.json({ status: 'ok' }));

// ════════════════════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════════════════════

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', authLimiter, async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await supabase.from('otp_codes').delete().eq('phone', phone);
    await supabase.from('otp_codes').delete().lt('expires_at', new Date().toISOString());
    await supabase.from('otp_codes').insert([{ phone, code: otp, expires_at: expiresAt }]);

    // Check if user exists
    const { data: existingUser } = await supabase.from('users').select('id').eq('phone', phone).maybeSingle();
    
    await sendOTP(phone, otp);
    res.json({ success: true, isNewUser: !existingUser });
  } catch (err) {
    console.error('[OTP send]', err.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', authLimiter, async (req, res) => {
  const { phone, otp, referredBy } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });
  try {
    const { data: stored } = await supabase
      .from('otp_codes').select('*').eq('phone', phone).eq('code', otp)
      .gt('expires_at', new Date().toISOString()).maybeSingle();

    if (!stored) return res.status(400).json({ error: 'Invalid or expired code' });
    await supabase.from('otp_codes').delete().eq('phone', phone);

    // Check if user exists
    const { data: existing } = await supabase.from('users').select('id').eq('phone', phone).maybeSingle();

    if (existing) {
      // Sign them in via admin — create a magic link token
      const { data: linkData, error } = await supabase.auth.admin.generateLink({
        type: 'magiclink', email: `${phone.replace(/\D/g, '')}@sabi.app`
      });
      if (error) throw error;
      // Exchange for session
      const { data: session } = await supabase.auth.verifyOtp({
        token_hash: linkData.properties?.hashed_token, type: 'email'
      });
      return res.json({ success: true, isNewUser: false, token: session?.session?.access_token });
    }

    // New user: create auth user
    const email = `${phone.replace(/\D/g, '')}@sabi.app`;
    const { data: newAuthUser, error: authErr } = await supabase.auth.admin.createUser({
      email, email_confirm: true, phone, phone_confirm: true,
      user_metadata: { phone }
    });
    if (authErr) throw authErr;

    // Create user profile
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await supabase.from('users').insert([{
      id: newAuthUser.user.id, phone, has_seeded: false,
      follow_up_hours: 48,
      notification_preferences: { summary: true, ghosting: true, payments: true },
      referral_code: referralCode,
      referred_by: referredBy || null
    }]);

    const { data: adminSession } = await supabase.auth.admin.generateLink({
      type: 'magiclink', email
    });
    const { data: sess } = await supabase.auth.verifyOtp({
      token_hash: adminSession?.properties?.hashed_token, type: 'email'
    });

    res.json({ success: true, isNewUser: true, token: sess?.session?.access_token });
  } catch (err) {
    console.error('[OTP verify]', err.message);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /api/auth/setup-profile  (called after business name entered)
app.post('/api/auth/setup-profile', async (req, res) => {
  const { phone, businessName } = req.body;
  if (!phone || !businessName) return res.status(400).json({ error: 'Missing fields' });
  try {
    const { data: user } = await supabase.from('users').select('id').eq('phone', phone).single();
    if (!user) return res.status(404).json({ error: 'User not found' });

    await supabase.from('users').update({ business_name: businessName }).eq('id', user.id);

    const email = `${phone.replace(/\D/g, '')}@sabi.app`;
    const { data: linkData } = await supabase.auth.admin.generateLink({ type: 'magiclink', email });
    const { data: sess } = await supabase.auth.verifyOtp({
      token_hash: linkData?.properties?.hashed_token, type: 'email'
    });

    res.json({ success: true, token: sess?.session?.access_token });
  } catch (err) {
    console.error('[setup-profile]', err.message);
    res.status(500).json({ error: 'Profile setup failed' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  DEALS
// ════════════════════════════════════════════════════════════════════════════

// GET /api/deals
app.get('/api/deals', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('deals').select('*, contacts(*)')
    .eq('user_id', req.user.id)
    .neq('status', 'paid')
    .order('last_contact_time', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// POST /api/deals
app.post('/api/deals', auth, async (req, res) => {
  const { contactInfo, title, amount } = req.body;
  if (!contactInfo || !title) return res.status(400).json({ error: 'contactInfo and title required' });
  const userId = req.user.id;
  try {
    const isPhone = /^\+?[0-9\s]{8,15}$/.test(contactInfo.trim());
    const phoneVal = isPhone ? contactInfo.replace(/\s/g, '') : `+000${Date.now()}`;

    let { data: contact } = await supabase
      .from('contacts').select('id')
      .eq('user_id', userId)
      .or(`phone.eq.${contactInfo.trim()},name.ilike.${contactInfo.trim()}`)
      .maybeSingle();

    if (!contact) {
      const { data: nc } = await supabase.from('contacts').insert([{
        user_id: userId, name: contactInfo.trim(), phone: phoneVal, last_seen: new Date()
      }]).select().single();
      contact = nc;
    }

    const { data: deal, error: dErr } = await supabase.from('deals').insert([{
      user_id: userId, contact_id: contact.id, title, amount: parseFloat(amount) || 0,
      status: 'inquiry', last_contact_time: new Date().toISOString()
    }]).select('*, contacts(*)').single();

    if (dErr) throw dErr;
    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/deals/:id
app.patch('/api/deals/:id', auth, async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body, updated_at: new Date().toISOString() };
  if (updates.status === 'paid') updates.last_contact_time = new Date().toISOString();

  const { data, error } = await supabase
    .from('deals').update(updates).eq('id', id).eq('user_id', req.user.id)
    .select('*, contacts(*)').single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/deals/:id/follow-up  — generate message + optionally send
app.post('/api/deals/:id/follow-up', auth, aiLimiter, async (req, res) => {
  const { id } = req.params;
  const { send = false, message: customMsg } = req.body;

  const { data: deal } = await supabase
    .from('deals').select('*, contacts(*)').eq('id', id).single();
  if (!deal) return res.status(404).json({ error: 'Deal not found' });

  let message = customMsg;

  if (!message) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful Nigerian business assistant. Generate a natural, friendly follow-up WhatsApp message for a vendor to send to a customer. Be concise (2-3 sentences max), warm, and professional. Use "Hi [Name]" to open. Do NOT use markdown.`
          },
          {
            role: 'user',
            content: `Vendor's business: ${deal.user_id}\nCustomer name: ${deal.contacts?.name}\nProduct/deal: ${deal.title}\nAmount: ₦${deal.amount || '?'}\nDeal summary: ${deal.summary || 'No notes'}\nStatus: ${deal.status}`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      }, { signal: controller.signal });

      clearTimeout(timeout);
      message = completion.choices[0].message.content.trim();
    } catch (err) {
      console.error('[AI follow-up gen]', err.message);
      const name = deal.contacts?.name?.split(' ')[0] || 'there';
      message = `Hi ${name}! Just checking in on the ${deal.title}. Are you still interested? Let me know 😊`;
    }
  }

  if (send && deal.contacts?.phone) {
    try {
      await sendWhatsApp(deal.contacts.phone, message);
      await supabase.from('deals').update({
        last_contact_time: new Date().toISOString(), updated_at: new Date().toISOString()
      }).eq('id', id);
    } catch (err) {
      console.error('[WA send]', err.message);
    }
  }

  res.json({ message, sent: send });
});

// ════════════════════════════════════════════════════════════════════════════
//  REVENUE
// ════════════════════════════════════════════════════════════════════════════

app.get('/api/revenue', auth, async (req, res) => {
  const { data: paid } = await supabase
    .from('deals').select('id, amount, updated_at, title, contacts(name)')
    .eq('user_id', req.user.id).eq('status', 'paid')
    .order('updated_at', { ascending: false });

  // Calculate recovered revenue
  const { data: followedUp } = await supabase
    .from('follow_up_queue')
    .select('deal_id')
    .eq('user_id', req.user.id)
    .eq('status', 'approved');

  const followedUpDealIds = new Set((followedUp || []).map(f => f.deal_id));
  const recoveredDeals = (paid || []).filter(d => followedUpDealIds.has(d.id));
  const recovered_revenue = recoveredDeals.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const recovered_deals_count = recoveredDeals.length;

  const { data: paystackPayments } = await supabase
    .from('payments').select('deal_id').eq('verified_status', 'verified');
  const paystackDealIds = new Set((paystackPayments || []).map(p => p.deal_id));

  const enrichedPaid = (paid || []).map(d => ({
    ...d,
    via_paystack: paystackDealIds.has(d.id)
  }));

  const now = new Date();
  const wStart = new Date(now); wStart.setDate(now.getDate() - now.getDay()); wStart.setHours(0,0,0,0);
  const wLast  = new Date(wStart); wLast.setDate(wStart.getDate() - 7);
  const mStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);

  const sum = (arr) => arr.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const filter = (arr, from, to) => arr.filter(d => { const t = new Date(d.updated_at); return t >= from && (!to || t < to); });

  const thisWeek  = filter(enrichedPaid, wStart);
  const lastWeek  = filter(enrichedPaid, wLast, wStart);
  const thisMonth = filter(enrichedPaid, mStart);
  const today     = filter(enrichedPaid, todayStart);

  const weekTotal = sum(thisWeek), lastWeekTotal = sum(lastWeek);
  const weekPct = lastWeekTotal ? Math.round(((weekTotal - lastWeekTotal) / lastWeekTotal) * 100) : null;

  res.json({
    today: sum(today), thisWeek: weekTotal, lastWeek: lastWeekTotal,
    weekPct, thisMonth: sum(thisMonth),
    recovered_revenue, recovered_deals: recovered_deals_count,
    recent: (enrichedPaid || []).slice(0, 20)
  });
});

// ════════════════════════════════════════════════════════════════════════════
//  PAYMENTS & REFERRALS
// ════════════════════════════════════════════════════════════════════════════

app.post('/api/payments/generate-link', auth, async (req, res) => {
  const { deal_id, amount, customer_phone } = req.body;
  if (!deal_id || !amount) return res.status(400).json({ error: 'deal_id and amount required' });
  if (!process.env.PAYSTACK_SECRET_KEY) return res.status(500).json({ error: 'Paystack not configured' });

  try {
    const email = `${customer_phone?.replace(/\D/g, '') || 'customer'}@sabi.app`;
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: Math.round(amount * 100), // Kobo
      metadata: { deal_id, user_id: req.user.id }
    }, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    });

    const { authorization_url, reference } = response.data.data;

    await supabase.from('payments').insert([{
      deal_id, amount, reference, verified_status: 'pending'
    }]);

    res.json({ payment_url: authorization_url, reference });
  } catch (err) {
    console.error('[Paystack Init]', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate link' });
  }
});

app.post('/api/webhook/paystack', async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.sendStatus(200);

  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  if (hash !== req.headers['x-paystack-signature']) return res.sendStatus(400);

  res.sendStatus(200);

  const event = req.body;
  if (event.event === 'charge.success') {
    const { reference, metadata, amount } = event.data;
    if (!metadata?.deal_id || !metadata?.user_id) return;

    try {
      await supabase.from('payments').update({ verified_status: 'verified' }).eq('reference', reference);
      await supabase.from('deals').update({ status: 'paid', last_contact_time: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', metadata.deal_id);

      const { data: user } = await supabase.from('users').select('phone').eq('id', metadata.user_id).single();
      const { data: deal } = await supabase.from('deals').select('contacts(name)').eq('id', metadata.deal_id).single();
      
      const { data: paid } = await supabase.from('deals').select('amount').eq('user_id', metadata.user_id).eq('status', 'paid').gte('updated_at', new Date().setHours(0,0,0,0));
      const todayTotal = paid?.reduce((s,d) => s + (Number(d.amount)||0), 0) || 0;

      if (user?.phone) {
        await sendWhatsApp(user.phone, `💰 Payment confirmed — ₦${amount/100} received from ${deal?.contacts?.name || 'customer'}.\nDeal closed. Today's total: ₦${todayTotal}`);
      }
    } catch (err) {
      console.error('[Paystack webhook handler]', err.message);
      await sendDiscordAlert('Paystack Webhook Failure', 'Error processing successful charge', err.message);
    }
  }
});

app.get('/api/referral/stats', auth, async (req, res) => {
  try {
    const { data: user } = await supabase.from('users').select('referral_code').eq('id', req.user.id).single();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const referralCode = user.referral_code;
    const { data: referredUsers } = await supabase.from('users').select('id, created_at').eq('referred_by', referralCode);
    
    // For MVP, total is count of referred. Pending = less than 30 days old. Earned = older than 30 days.
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    let pending = 0;
    let earned = 0;
    
    (referredUsers || []).forEach(ru => {
      if (new Date(ru.created_at) < thirtyDaysAgo) earned++;
      else pending++;
    });

    res.json({
      referral_code: referralCode,
      referral_link: `${process.env.ALLOWED_ORIGINS?.split(',')[0] || 'http://localhost:5173'}/auth?ref=${referralCode}`,
      total_referrals: (referredUsers || []).length,
      pending_referrals: pending,
      earned_months: earned
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
//  WHATSAPP WEBHOOK
// ════════════════════════════════════════════════════════════════════════════

app.get('/api/webhook/whatsapp', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(req.query['hub.challenge']);
  }
  res.sendStatus(403);
});

app.post('/api/webhook/whatsapp', async (req, res) => {
  // HMAC signature check
  if (process.env.WHATSAPP_WEBHOOK_SECRET) {
    const sig = req.headers['x-hub-signature-256'];
    const hmac = `sha256=${crypto.createHmac('sha256', process.env.WHATSAPP_WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex')}`;
    if (sig !== hmac) return res.status(401).json({ error: 'Bad signature' });
  }

  res.sendStatus(200); // Respond immediately

  const body = req.body;
  if (!body?.entry?.[0]?.changes?.[0]?.value?.messages) return;

  const msg      = body.entry[0].changes[0].value.messages[0];
  const metadata = body.entry[0].changes[0].value.metadata;
  const from     = msg.from;
  const to       = metadata.display_phone_number;
  const text     = msg.text?.body;
  const msgId    = msg.id;

  if (!text) return;

  try {
    // Idempotency
    const { data: dup } = await supabase.from('chat_messages').select('id').eq('whatsapp_id', msgId).maybeSingle();
    if (dup) return;

    // Check if this is a SEND/SKIP reply TO Sabi system
    const sabiSystemPhone = process.env.SABI_SYSTEM_PHONE;
    if (sabiSystemPhone && to.replace(/\D/g,'') === sabiSystemPhone.replace(/\D/g,'')) {
      await handleVendorReply(from, text.trim().toUpperCase());
      return;
    }

    // Normal inbound: resolve vendor by "to" number
    const { data: vendor } = await supabase.from('users').select('id').eq('phone', to).maybeSingle();
    if (!vendor) return;

    const userId = vendor.id;

    // Resolve/create contact
    let { data: contact } = await supabase.from('contacts').select('id').eq('phone', from).eq('user_id', userId).maybeSingle();
    if (!contact) {
      const { data: nc } = await supabase.from('contacts').insert([{
        user_id: userId, phone: from, name: from, last_seen: new Date()
      }]).select().single();
      contact = nc;
    }

    // Store message
    const { data: chatMsg } = await supabase.from('chat_messages').insert([{
      user_id: userId, contact_id: contact.id, body: text,
      direction: 'inbound', whatsapp_id: msgId, timestamp: new Date()
    }]).select().single();

    // Publish to background processing
    if (process.env.QSTASH_TOKEN && chatMsg) {
      await axios.post('https://qstash.upstash.io/v2/publish/url', {
        url: `${process.env.SERVER_URL}/api/jobs/process-message`,
        body: JSON.stringify({ message_id: chatMsg.id })
      }, { headers: { Authorization: `Bearer ${process.env.QSTASH_TOKEN}`, 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    console.error('[Webhook error]', err.message);
  }
});

// SEND/SKIP handler from vendor WhatsApp replies
async function handleVendorReply(vendorPhone, command) {
  const { data: vendor } = await supabase.from('users').select('id').eq('phone', vendorPhone).maybeSingle();
  if (!vendor) return;

  const { data: pending } = await supabase
    .from('follow_up_queue').select('*, deals(*, contacts(*))')
    .eq('user_id', vendor.id).eq('status', 'pending')
    .order('created_at', { ascending: true }).limit(1).maybeSingle();

  if (!pending) return;

  if (command === 'SEND') {
    const customerPhone = pending.deals?.contacts?.phone;
    if (customerPhone) {
      await sendWhatsApp(customerPhone, pending.message);
      await supabase.from('deals').update({ last_contact_time: new Date().toISOString() }).eq('id', pending.deal_id);
    }
    await supabase.from('follow_up_queue').update({ status: 'approved' }).eq('id', pending.id);
    await sendWhatsApp(vendorPhone, `✅ Message sent to ${pending.deals?.contacts?.name || 'customer'}.`);
  } else if (command === 'SKIP') {
    await supabase.from('follow_up_queue').update({ status: 'skipped' }).eq('id', pending.id);
    await sendWhatsApp(vendorPhone, `✅ Skipped.`);
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  BACKGROUND JOBS
// ════════════════════════════════════════════════════════════════════════════

// POST /api/jobs/process-message
app.post('/api/jobs/process-message', jobAuth, async (req, res) => {
  const { message_id } = req.body;
  if (!message_id) return res.status(400).json({ error: 'message_id required' });
  res.sendStatus(200);

  try {
    const { data: msg } = await supabase.from('chat_messages').select('*, contacts(*)').eq('id', message_id).single();
    if (!msg) return;

    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const extraction = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a commerce intelligence AI. Analyze this WhatsApp message from a customer to a Nigerian vendor. Return JSON: {"is_commerce":bool,"confidence":number,"title":string,"amount":number|null}' },
        { role: 'user', content: msg.body }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300, temperature: 0.1
    }, { signal: controller.signal });

    const result = JSON.parse(extraction.choices[0].message.content);
    if (!result.is_commerce || result.confidence < 70) return;

    // Find or create deal
    const { data: existing } = await supabase
      .from('deals').select('id').eq('contact_id', msg.contact_id)
      .eq('user_id', msg.user_id).neq('status', 'paid').maybeSingle();

    if (existing) {
      await supabase.from('deals').update({
        last_contact_time: new Date().toISOString(), updated_at: new Date().toISOString()
      }).eq('id', existing.id);
      await supabase.from('chat_messages').update({ deal_id: existing.id }).eq('id', message_id);
    } else {
      const { data: deal } = await supabase.from('deals').insert([{
        user_id: msg.user_id, contact_id: msg.contact_id,
        title: result.title || 'Untitled Product', amount: result.amount || 0,
        status: 'inquiry', last_contact_time: new Date().toISOString()
      }]).select().single();
      if (deal) await supabase.from('chat_messages').update({ deal_id: deal.id }).eq('id', message_id);
    }
  } catch (err) {
    console.error('[process-message]', err.message);
    await sendDiscordAlert('AI Extraction Failure', `Failed to process message ID: ${message_id}`, err.message);
  }
});

// POST /api/jobs/check-follow-ups
app.post('/api/jobs/check-follow-ups', jobAuth, async (req, res) => {
  res.sendStatus(200);
  try {
    const { data: vendors } = await supabase.from('users').select('id, phone, follow_up_hours').eq('whatsapp_connected', true);
    if (!vendors?.length) return;

    for (const vendor of vendors) {
      const hours = vendor.follow_up_hours || 48;
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const { data: staleDeal } = await supabase
        .from('deals').select('*, contacts(*)')
        .eq('user_id', vendor.id).neq('status', 'paid').neq('status', 'ghosted')
        .lt('last_contact_time', cutoff).order('last_contact_time', { ascending: true }).limit(1).maybeSingle();

      if (!staleDeal) continue;

      // Generate follow-up message
      let message;
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Generate a short, friendly WhatsApp follow-up message (2-3 sentences). Nigerian business English. No markdown.' },
            { role: 'user', content: `Customer: ${staleDeal.contacts?.name}, Product: ${staleDeal.title}, Amount: ₦${staleDeal.amount}` }
          ],
          max_tokens: 150, temperature: 0.7
        });
        message = completion.choices[0].message.content.trim();
      } catch {
        message = `Hi ${staleDeal.contacts?.name?.split(' ')[0] || 'there'}! Just checking in on the ${staleDeal.title}. Are you still interested?`;
      }

      // Create queue entry
      const { data: queueEntry } = await supabase.from('follow_up_queue').insert([{
        user_id: vendor.id, deal_id: staleDeal.id,
        contact_id: staleDeal.contact_id, message, status: 'pending'
      }]).select().single();

      // Notify vendor via WhatsApp
      if (vendor.phone && queueEntry) {
        const days = Math.floor((Date.now() - new Date(staleDeal.last_contact_time).getTime()) / 86400000);
        await sendWhatsApp(vendor.phone,
          `🔔 Sabi: Follow up with ${staleDeal.contacts?.name} about "${staleDeal.title}" (${days}d ago)\n\nSuggested:\n"${message}"\n\nReply SEND to send, SKIP to skip.`
        );
      }
    }
  } catch (err) {
    console.error('[check-follow-ups]', err.message);
    await sendDiscordAlert('QStash Job Failure: check-follow-ups', 'Job encountered an error', err.message);
  }
});

// POST /api/jobs/morning-brief
app.post('/api/jobs/morning-brief', jobAuth, async (req, res) => {
  res.sendStatus(200);
  try {
    const { data: vendors } = await supabase.from('users').select('id, phone, business_name').eq('whatsapp_connected', true);
    if (!vendors?.length) return;

    for (const vendor of vendors) {
      const { data: deals } = await supabase.from('deals').select('status, amount').eq('user_id', vendor.id);
      if (!deals?.length) continue;

      const open   = deals.filter(d => d.status !== 'paid').length;
      const paid   = deals.filter(d => d.status === 'paid');
      const today  = new Date(); today.setHours(0,0,0,0);
      const todayRev = paid.filter(d => new Date(d.updated_at) >= today).reduce((s,d) => s + (d.amount||0), 0);
      const totalRev  = paid.reduce((s,d) => s + (d.amount||0), 0);

      if (vendor.phone) {
        await sendWhatsApp(vendor.phone,
          `☀️ Good morning from Sabi!\n\n📊 Your Summary:\n• Open deals: ${open}\n• Today's revenue: ₦${todayRev.toLocaleString()}\n• Total revenue: ₦${totalRev.toLocaleString()}\n\nHave a great day! 💚`
        );
      }
    }
  } catch (err) {
    console.error('[morning-brief]', err.message);
    await sendDiscordAlert('QStash Job Failure: morning-brief', 'Job encountered an error', err.message);
  }
});

// POST /api/whatsapp/register-number
app.post('/api/whatsapp/register-number', auth, async (req, res) => {
  const { phone_number_id, access_token } = req.body;
  if (!phone_number_id || !access_token) return res.status(400).json({ error: 'Missing credentials' });
  
  try {
    // In a real production app, you would encrypt the access_token before storing.
    // For MVP, we'll store them directly in the DB or encrypted column.
    await supabase.from('users').update({ 
      whatsapp_connected: true,
      whatsapp_phone_id: phone_number_id,
      // For MVP we just use the system token, but if we stored per-user token:
      // whatsapp_access_token: access_token 
    }).eq('id', req.user.id);
    res.json({ success: true });
  } catch (err) {
    console.error('[register-number]', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Global Error Handler
app.use(async (err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  await sendDiscordAlert('Unhandled Exception', `Error on ${req.method} ${req.url}`, err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ─── START ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(port, () => console.log(`[Sabi] Server on :${port}`));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
  process.on('SIGINT',  () => server.close(() => process.exit(0)));
}

export default app;
