import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 pb-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-background to-background pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-8"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent mb-12 shadow-[0_0_50px_rgba(37,211,102,0.2)]">
          <MessageCircle size={40} />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
            You just missed a deal.<br />
            <span className="text-text-muted">Sabi wouldn't have.</span>
          </h1>
          <p className="text-lg text-text-muted/80 leading-relaxed max-w-sm">
            Connect your WhatsApp Business number and Sabi will automatically extract deals, log them, and remind you to follow up.
          </p>
        </div>

        <div className="pt-8 space-y-4">
          <button
            onClick={() => navigate('/connect')}
            className="w-full h-14 bg-accent text-primary rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_10px_40px_rgba(37,211,102,0.3)]"
          >
            Connect WhatsApp to start
            <ArrowRight size={20} />
          </button>
          
          <div className="flex items-center justify-center gap-2 text-text-muted/50 text-xs font-medium pt-4">
            <ShieldCheck size={14} />
            <span>Official Meta Business Partner integration</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
