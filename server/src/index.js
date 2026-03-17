import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

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

// --- ROUTES ---

// 1. AI Deal Extraction
app.post('/api/ai/extract-deal', async (req, res) => {
  const { chatText } = req.body;

  if (!chatText) {
    return res.status(400).json({ error: 'No chat text provided' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Sabi, a sales assistant for African SME vendors in Nigeria, Ghana, and Kenya. 
          Analyse this WhatsApp conversation and return ONLY a JSON object with: 
          is_deal (boolean), item (string or null), price (number or null), 
          currency (string, default 'NGN'), customer_name (string or null), 
          customer_constraint (string or null), summary (string, 2 sentences, plain English), 
          suggested_reply (string, casual warm WhatsApp message, Nigerian friendly tone), 
          intent ('hot_lead' | 'cold' | 'ready_to_pay' | 'browsing'). 
          Return only valid JSON. No markdown.`
        },
        { role: "user", content: chatText }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('AI Extraction error:', error);
    res.status(500).json({ error: 'Failed to analyze chat' });
  }
});

// 2. WhatsApp Webhook (Stub)
app.post('/api/webhook/whatsapp', async (req, res) => {
  console.log('Incoming WhatsApp Webhook:', req.body);
  
  // Replace with 360dialog or Twilio webhook handler
  // 1. Parse incoming message body
  // 2. Find or create contact
  // 3. Run AI intent extraction
  // 4. Auto-create deal if commercial intent
  // 5. Fire FCM push notification to Sabi frontend
  
  res.status(200).json({ status: 'received' });
});

// 3. Deals API
app.get('/api/deals', async (req, res) => {
  const { data, error } = await supabase
    .from('deals')
    .select('*, contacts(*)');
  
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post('/api/deals', async (req, res) => {
  const { data, error } = await supabase
    .from('deals')
    .insert([req.body])
    .select();
  
  if (error) return res.status(500).json(error);
  res.status(201).json(data[0]);
});

// 4. Analytics Summary
app.get('/api/analytics/summary', async (req, res) => {
  // Mocking analytics for MVP
  res.json({
    totalDeals: 84,
    closedDeals: 38,
    revenue: 2450000,
    ghosted: 12,
    sabiRecovered: 340000
  });
});

app.listen(port, () => {
  console.log(`Sabi Server running on port ${port}`);
});
