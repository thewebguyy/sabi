import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import { sendOTP, sendSMS } from './utils/notifications.js';

dotenv.config();

// Environment Validation
const requiredEnv = ['VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY'];
const validateEnv = () => {
  const missing = requiredEnv.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`CRITICAL: Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};
validateEnv();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());
app.use(morgan('dev'));

// Supabase & OpenAI Setup
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No authorization header' });

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ error: 'Invalid or expired token' });

  req.user = user;
  next();
};

const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many AI requests' }
});

// --- ROUTES ---

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));

// 0. Auth
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  try {
    const otp = await sendOTP(phone);
    
    // Store in DB for persistence across instances
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins
    await supabase.from('otp_codes').delete().eq('phone', phone); // Clear old ones
    await supabase.from('otp_codes').insert([{ phone, code: otp.toString(), expires_at: expiresAt }]);
    
    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  
  try {
    const { data: stored, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', otp)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (stored) {
      await supabase.from('otp_codes').delete().eq('phone', phone);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// 1. AI Extraction
app.post('/api/ai/extract-deal', authMiddleware, aiRateLimiter, async (req, res) => {
  const { chatText } = req.body;
  if (!chatText) return res.status(400).json({ error: 'No text' });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: 'Analyze chat. Return JSON: { is_deal, title, amount, summary, customer_constraint, ai_reply, intent, phone_number }' },
        { role: "user", content: chatText }
      ],
      response_format: { type: "json_object" }
    });
    res.json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

// 2. WhatsApp Webhook (Fixed User Resolution & Security)
app.post('/api/webhook/whatsapp', async (req, res) => {
  const { body, from, to } = req.body;
  const signature = req.headers['x-hub-signature-256'];
  const secret = process.env.WEBHOOK_SECRET;

  if (secret && signature) {
    const crypto = await import('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
    if (signature !== digest) {
        return res.status(401).json({ error: 'Invalid signature' });
    }
  }
  
  if (!body || !from || !to) return res.status(400).json({ error: 'Missing fields' });

  try {
    // Resolve which Sabi user (vendor) this belongs to based on the destination number
    const { data: user, error: userError } = await supabase.from('users').select('id').eq('phone', to).single();
    if (userError || !user) {
        console.error('Vendor not found for number:', to);
        return res.status(404).json({ error: 'Vendor not found' });
    }
    const userId = user.id;

    let { data: contact } = await supabase.from('contacts').select('id').eq('phone', from).eq('user_id', userId).single();
    if (!contact) {
      const { data: nc } = await supabase.from('contacts').insert([{ user_id: userId, phone: from, name: from, last_seen: new Date() }]).select().single();
      contact = nc;
    }

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: 'Extract deal info from chat. Return JSON: { is_deal, title, amount, summary, customer_constraint, ai_reply }' }, { role: "user", content: body }],
      response_format: { type: "json_object" }
    });
    const aiResult = JSON.parse(aiResponse.choices[0].message.content);

    let dealId = null;
    if (aiResult.is_deal) {
      const { data: deal } = await supabase.from('deals').insert([{
        user_id: userId, contact_id: contact.id, title: aiResult.title || 'Inquiry', amount: aiResult.amount || 0,
        summary: aiResult.summary, customer_constraint: aiResult.customer_constraint,
        ai_suggested_reply: aiResult.ai_reply, status: 'pending'
      }]).select().single();
      dealId = deal?.id;
    }

    await supabase.from('chat_messages').insert([{ user_id: userId, contact_id: contact.id, deal_id: dealId, body, direction: 'inbound', timestamp: new Date() }]);
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// 3. Deals API
app.get('/api/deals', authMiddleware, async (req, res) => {
  try {
      const { data, error } = await supabase.from('deals').select('*, contacts(*)').eq('user_id', req.user.id).order('created_at', { ascending: false });
      if (error) throw error;
      res.json(data || []);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// 4. Paystack
app.post('/api/payments/initialize', authMiddleware, async (req, res) => {
  const { dealId, amount } = req.body;
  if (!dealId || !amount) return res.status(400).json({ error: 'Missing dealId or amount' });

  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email: `${req.user.phone}@sabi.app`,
      amount: Math.round(amount * 100), // kobo
      metadata: { deal_id: dealId, user_id: req.user.id }
    }, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
    
    const { authorization_url, reference } = response.data.data;
    await supabase.from('payments').insert([{ deal_id: dealId, amount, verified_status: 'pending' }]);
    res.json({ checkoutUrl: authorization_url, reference });
  } catch (error) {
    console.error('Payment init error:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

app.get('/api/payments/verify/:reference', authMiddleware, async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    });

    if (response.data.data.status === 'success') {
      const { deal_id } = response.data.data.metadata;
      
      // Update payment record
      await supabase.from('payments').update({ verified_status: 'verified' }).eq('deal_id', deal_id);
      // Mark deal as paid
      await supabase.from('deals').update({ status: 'paid' }).eq('id', deal_id);
      
      res.json({ status: 'success' });
    } else {
      res.json({ status: 'failed' });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// 5. Analytics
app.get('/api/analytics/summary', authMiddleware, async (req, res) => {
  try {
      const { data: deals, error } = await supabase.from('deals').select('amount, status, created_at').eq('user_id', req.user.id);
      if (error) throw error;

      const summary = (deals || []).reduce((acc, d) => {
        acc.totalDeals++;
        if (d.status === 'paid') { 
            acc.closedDeals++; 
            acc.revenue += (Number(d.amount) || 0); 
        }
        if (d.status === 'ghosted') acc.ghosted++;
        return acc;
      }, { totalDeals: 0, closedDeals: 0, revenue: 0, ghosted: 0 });

      res.json(summary);
  } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

const server = app.listen(port, () => console.log(`Sabi Server on ${port}`));

// SIGTERM handler
const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
