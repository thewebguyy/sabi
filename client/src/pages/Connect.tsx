import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, Shield, Smartphone } from 'lucide-react';
import { useStore } from '../store/useStore';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const Connect: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser, token } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_META_APP_ID || '807558255232766', // fallback for dev
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v17.0'
      });
    };

    (function (d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s) as HTMLScriptElement; js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleConnect = () => {
    if (!window.FB) {
      setError('Facebook SDK failed to load. Please check your connection.');
      return;
    }
    setError('');
    setLoading(true);

    window.FB.login((response: any) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        
        // For embedded signup, Meta typically returns the WABA ID and Phone Number ID via a separate API call 
        // or webhook, but we'll mock the completion for the MVP frontend using the access token.
        // In a full implementation, you would query the Graph API to get the phone_number_id here.
        
        // Mocking the extraction of phone_number_id for MVP
        const mockPhoneNumberId = "whatsapp_" + Date.now();

        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/whatsapp/register-number`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            phone_number_id: mockPhoneNumberId,
            access_token: accessToken
          })
        }).then(res => res.json())
          .then(data => {
            if (data.success) {
              updateUser({ whatsapp_connected: true, whatsapp_phone_id: mockPhoneNumberId });
              navigate('/deals');
            } else {
              setError(data.error || 'Failed to register number');
              setLoading(false);
            }
          })
          .catch(err => {
            setError(err.message);
            setLoading(false);
          });
      } else {
        setError('Login cancelled or failed.');
        setLoading(false);
      }
    }, {
      scope: 'business_management,whatsapp_business_messaging,whatsapp_business_management',
      return_scopes: true
    });
  };

  const handleSkip = () => {
    // Just navigate to deals, we don't force them back here
    localStorage.setItem('sabi_has_skipped_connect', 'true');
    navigate('/deals');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 pb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-surface to-background pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm mx-auto bg-surface border border-white/5 p-8 rounded-3xl shadow-2xl"
      >
        <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center text-[#25D366] mb-6 mx-auto">
          <Smartphone size={32} />
        </div>

        <h2 className="text-2xl font-extrabold text-center mb-3">Connect WhatsApp</h2>
        <p className="text-text-muted text-center text-sm mb-8 leading-relaxed">
          Connect your WhatsApp Business number so Sabi can read your customer messages automatically. Takes 2 minutes. You only do this once.
        </p>

        {error && (
          <div className="bg-hot/10 text-hot text-xs p-3 rounded-lg mb-6 text-center border border-hot/20">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full h-14 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                <Shield size={20} />
                Connect with Facebook
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            disabled={loading}
            className="w-full h-14 bg-transparent border border-white/10 text-text-muted rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
          >
            Skip for now
            <ArrowRight size={16} />
          </button>
        </div>
        
        <p className="text-center text-[10px] text-text-muted/40 mt-8">
          By connecting, you agree to Meta's WhatsApp Business terms of service.
        </p>
      </motion.div>
    </div>
  );
};

export default Connect;
