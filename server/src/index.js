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

// Simple OTP Store (In-memory for demo, should be Redis)
const otpStore = new Map();

// 0. Auth
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  try {
    const otp = await sendOTP(phone);
    otpStore.set(phone, { otp: '123456', expires: Date.now() + 600000 }); // Bypass 123456 for demo
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// 1. AI Extraction
// ... keep AI code ...

// 2. WhatsApp Webhook (Fixed User Resolution)
app.post('/api/webhook/whatsapp', async (req, res) => {
  const { body, from, to } = req.body;
  
  // SECURE: Verify HMAC signature should go here
  // SECURE: Any input sanitization

  try {
    // Resolve which Sabi user this belongs to
    const { data: users } = await supabase.from('users').select('id').eq('phone', to).single();
    if (!users) return res.status(404).json({ error: 'Vendor not found' });
    const userId = users.id;

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

    await supabase.from('chat_messages').insert([{ user_id: userId, contact_id: contact.id, deal_id: dealId, body, direction: 'inbound' }]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Webhook error' });
  }
});

// 3. Deals API (keep)

// 4. Paystack
app.post('/api/payments/initialize', authMiddleware, async (req, res) => {
  // ... keep ...
});

app.get('/api/payments/verify/:reference', authMiddleware, async (req, res) => {
  const { reference } = req.params;
  // ... rest of verify logic ...
  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    });
    if (response.data.data.status === 'success') {
      const { deal_id } = response.data.data.metadata;
      await supabase.from('payments').update({ verified_status: 'verified' }).eq('deal_id', deal_id);
      await supabase.from('deals').update({ status: 'paid' }).eq('id', deal_id);
      res.json({ status: 'success' });
    } else {
      res.json({ status: 'failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verify error' });
  }
});

// 5. Analytics
app.get('/api/analytics/summary', authMiddleware, async (req, res) => {
  const { data: deals } = await supabase.from('deals').select('amount, status').eq('user_id', req.user.id);
  const summary = (deals || []).reduce((acc, d) => {
    acc.totalDeals++;
    if (d.status === 'paid') { acc.closedDeals++; acc.revenue += (d.amount || 0); }
    if (d.status === 'ghosted') acc.ghosted++;
    return acc;
  }, { totalDeals: 0, closedDeals: 0, revenue: 0, ghosted: 0 });
  res.json(summary);
});

app.listen(port, () => console.log(`Sabi Server on ${port}`));
