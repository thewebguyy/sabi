import axios from 'axios';

// --- SMS PROVIDERS (STUBS) ---

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
  // Store OTP in Redis or Supabase with TTL in a real app
  // For demo, we just log it or send to phone
  await sendSMS(phone, `Your Sabi verification code is: ${otp}. Do not share this with anyone.`);
  return otp;
};
