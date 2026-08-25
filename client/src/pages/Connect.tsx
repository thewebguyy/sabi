import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const Connect: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useStore();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    await updateProfile({ business_name: 'Connected Store' });
    setLoading(false);
    navigate('/today');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F2EF] p-6 flex flex-col justify-between">
      <div className="mt-12 space-y-6 max-w-sm mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#FFB020]/15 text-[#FFB020] flex items-center justify-center border border-[#FFB020]/30 font-bold">
          <ShieldCheck size={24} />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-[#F3F2EF]">Connect WhatsApp</h2>
          <p className="text-xs text-[#8E8E93] mt-2 leading-relaxed">
            Sabi operates as a memory engine alongside WhatsApp. Share or paste chats directly to track sales.
          </p>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-[#10B981]" />
            <span className="text-xs text-[#F3F2EF]">No direct WhatsApp API connection needed</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-[#10B981]" />
            <span className="text-xs text-[#F3F2EF]">Zero risk to your WhatsApp phone number</span>
          </div>
        </div>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-[#FFB020] text-[#0A0A0A] font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,176,32,0.2)] active:scale-95 transition-all"
        >
          {loading ? 'Connecting...' : <><span>Continue to Sabi</span><ArrowRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};

export default Connect;
