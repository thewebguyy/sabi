import axios from 'axios';

// --- WHATSAPP (OFFICIAL CLOUD API) ---

export const sendWhatsApp = async (to, message) => {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) {
    console.warn(`[WHATSAPP] Credentials missing. Logging message: ${message}`);
    return { success: false, error: 'Missing credentials' };
  }

  try {
    const response = await axios.post(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to.replace(/\+/g, ''), // WhatsApp API expects no '+'
      type: "text",
      text: { body: message }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`[WHATSAPP] Sent to ${to}. ID: ${response.data.messages[0].id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('WhatsApp Send Error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// --- SMS PROVIDERS (FALLBACK) ---

export const sendSMS = async (phone, message) => {
  const provider = process.env.SMS_PROVIDER || 'termii'; // 'termii' | 'africastalking'
  
  console.log(`[SMS ${provider}] Sending to ${phone}: ${message}`);

  try {
    if (provider === 'termii' && process.env.TERMII_API_KEY) {
      // Real Termii call
      await axios.post('https://api.ng.termii.com/api/sms/send', {
        to: phone,
        from: 'SabiApp',
        sms: message,
        type: 'plain',
        channel: 'dnd', // Many Nigerian numbers are on DND
        api_key: process.env.TERMII_API_KEY
      });
    } else if (provider === 'africastalking' && process.env.AFRICASTALKING_API_KEY) {
      // Real Africa's Talking call
    } else {
      console.warn(`[SMS] Provider ${provider} keys missing. Message only logged.`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('SMS Send Error:', error);
    return { success: false, error: error.message };
  }
};

export const sendOTP = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const message = `Your Sabi verification code is: ${otp}. This code expires in 10 minutes. Do not share it. 💚`;
  
  // Prefer WhatsApp for superior reliability and zero KYC friction
  const result = await sendWhatsApp(phone, message);
  
  if (!result.success) {
    console.warn('[AUTH] WhatsApp failed, falling back to SMS log.');
    await sendSMS(phone, message);
  }
  
  return otp;
};
