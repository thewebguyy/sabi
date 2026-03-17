import axios from 'axios';

// --- SMS PROVIDERS (STUBS) ---

export const sendSMS = async (phone, message) => {
  const provider = process.env.SMS_PROVIDER || 'termii'; // 'termii' | 'africastalking'
  
  console.log(`[SMS ${provider}] Sending to ${phone}: ${message}`);

  try {
    if (provider === 'termii') {
      // Real Termii call
      // await axios.post('https://api.ng.termii.com/api/sms/send', {
      //   to: phone,
      //   from: 'SabiApp',
      //   sms: message,
      //   type: 'plain',
      //   api_key: process.env.TERMII_API_KEY
      // });
    } else if (provider === 'africastalking') {
      // Real Africa's Talking call
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
