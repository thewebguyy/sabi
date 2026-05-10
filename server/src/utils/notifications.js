import axios from 'axios';

// ─── Send text message via WhatsApp Cloud API ─────────────────────────────
export const sendWhatsAppText = async (to, text) => {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) { console.warn('[WA] Missing credentials'); return { success: false }; }
  try {
    const res = await axios.post(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace(/\D/g, ''),
      type: 'text',
      text: { body: text, preview_url: false }
    }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    console.log(`[WA] Sent to ${to}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.error('[WA send error]', err.response?.data?.error || err.message);
    return { success: false, error: err.message };
  }
};

// ─── Send OTP ────────────────────────────────────────────────────────────────
export const sendOTP = async (phone, otp) => {
  const message = `Your Sabi CRM verification code is: ${otp}\n\nExpires in 10 minutes.`;
  
  // Try WhatsApp first
  const waResult = await sendWhatsAppText(phone, message);
  if (waResult.success) return { success: true, via: 'whatsapp' };

  // Fallback to SMS (Termii)
  return await sendSMS(phone, `Your Sabi code: ${otp}. Expires in 10 mins.`);
};

// ─── SMS via Termii ───────────────────────────────────────────────────────────
export const sendSMS = async (phone, message) => {
  if (!process.env.TERMII_API_KEY) {
    console.warn('[SMS] No Termii key — OTP:', message);
    return { success: true, via: 'console' };
  }
  try {
    await axios.post('https://api.ng.termii.com/api/sms/send', {
      to: phone, from: 'SabiCRM', sms: message,
      type: 'plain', channel: 'dnd', api_key: process.env.TERMII_API_KEY
    });
    return { success: true, via: 'sms' };
  } catch (err) {
    console.error('[SMS error]', err.message);
    return { success: false, error: err.message };
  }
};
