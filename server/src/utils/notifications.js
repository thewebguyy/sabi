import axios from 'axios';

// --- WHATSAPP (OFFICIAL CLOUD API) ---

export const sendWhatsApp = async (to, otp) => {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) {
    console.warn(`[WHATSAPP] Credentials missing. Logging OTP ${otp} to ${to}`);
    return { success: false, error: 'Missing credentials' };
  }

  try {
    // HARDENED: Use official WhatsApp Template for OTP (Superior deliverability)
    const response = await axios.post(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to.replace(/\+/g, '').replace(/\s/g, ''), // Strict formatting
      type: "template",
      template: {
        name: "hello_world", // Meta's default testing template. Update to "sabi_otp" after approval.
        language: { code: "en_US" }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`[WHATSAPP] Template sent to ${to}. ID: ${response.data.messages[0].id}`);
    return { success: true, data: response.data };
  } catch (error) {
    const errorData = error.response?.data?.error || { message: error.message };
    console.error('WhatsApp Send Error:', errorData);
    return { success: false, error: errorData.message };
  }
};

// --- OTP LOGIC ---

export const sendOTP = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Prefer WhatsApp for superior reliability
  const result = await sendWhatsApp(phone, otp);
  
  if (!result.success) {
    console.warn('[AUTH] WhatsApp failed, falling back to SMS.');
    const message = `Your Sabi verification code is: ${otp}. Expires in 10 minutes.`;
    await sendSMS(phone, message);
  }
  
  return otp;
};

// --- SMS PROVIDERS (FALLBACK) ---

export const sendSMS = async (phone, message) => {
  const provider = process.env.SMS_PROVIDER || 'termii';

  try {
    if (provider === 'termii' && process.env.TERMII_API_KEY) {
      await axios.post('https://api.ng.termii.com/api/sms/send', {
        to: phone,
        from: 'SabiCRM',
        sms: message,
        type: 'plain',
        channel: 'dnd',
        api_key: process.env.TERMII_API_KEY
      });
      console.log(`[SMS Termii] Sent to ${phone}`);
    } else {
      console.warn(`[SMS] Provider ${provider} keys missing. Message: ${message}`);
    }
    return { success: true };
  } catch (error) {
    console.error('SMS Send Error:', error.message);
    return { success: false, error: error.message };
  }
};
