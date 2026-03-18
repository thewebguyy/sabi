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

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Supabase & OpenAI Setup
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
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

// Simple OTP Store (In-memory for demo, should be Redis in production)
const otpStore = new Map();

// 0. Auth
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  try {
    const otp = await sendOTP(phone);
    // For demo, we still allow 123456 as a universal bypass, but we store the real one too.
    otpStore.set(phone, { otp: otp.toString(), expires: Date.now() + 600000 });
    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const stored = otpStore.get(phone);

  if (otp === '123456' || (stored && stored.otp === otp && stored.expires > Date.now())) {
    otpStore.delete(phone);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid or expired OTP' });
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
        { role: "system", content: 'Analyze chat. Return JSON: { is_deal, title, amount, summary, customer_constraint, ai_reply, intent }' },
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

// 2. WhatsApp Webhook (Fixed User Resolution)
app.post('/api/webhook/whatsapp', async (req, res) => {
  const { body, from, to } = req.body;
  
  // SECURE: Verify HMAC signature should go here in production
  
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
      messages: [{ role: "system", content: 'Extract deal info from chat. Return JSON.' }, { role: "user", content: body }],
      response_format: { type: "json_object" }
    });
    const aiResult = JSON.parse(aiResponse.choices[0].message.content);

    let dealId = null;
    if (aiResult.is_deal) {
      const { data: deal } = await supabase.from('deals').insert([{
        user_id: userId, contact_id: contact.id, title: aiResult.title, amount: aiResult.amount,
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
      const { data, error } = await supabase.from('deals').select('*, contacts(*)').eq('user_id', req.user.id);
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
      amount: amount * 100, // kobo
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
      // Use Supabase aggregate queries or simple select for MVP
      const { data: deals, error } = await supabase.from('deals').select('amount, status').eq('user_id', req.user.id);
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

app.listen(port, () => console.log(`Sabi Server on ${port}`));
