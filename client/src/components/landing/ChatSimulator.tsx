import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, MessageCircle, Clock, ExternalLink } from 'lucide-react'

type SimState = 'idle' | 'nudge' | 'sent'

const ChatSimulator: React.FC = () => {
  const [state, setState] = useState<SimState>('idle')

  const handleFollowUp = () => {
    setState('sent')
  }

  return (
    <section className="py-16 px-6" id="simulator">
      <div className="max-w-md mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-3">
          See how this works
        </p>
        <h2 className="text-2xl font-display font-extrabold mb-8 leading-tight">
          A customer asked about your product.<br />
          <span className="text-text-muted">Then went quiet.</span>
        </h2>

        {/* Chat area */}
        <div className="bg-surface rounded-3xl border border-surface-border p-5 space-y-4">
          {/* WhatsApp-style conversation */}
          <div className="space-y-3">
            {/* Incoming message */}
            <div className="flex justify-start">
              <div className="chat-bubble-incoming">
                <p>Hi, is the burgundy lace still available? How much for 5 yards?</p>
                <span className="text-[10px] text-text-muted mt-1 block text-right">10:32 AM</span>
              </div>
            </div>

            {/* Vendor reply */}
            <div className="flex justify-end">
              <div className="chat-bubble-outgoing">
                <p>Yes! ₦13,000 per yard. I can do ₦60,000 for 5 yards. Send your address and I'll arrange dispatch 🙌</p>
                <span className="text-[10px] text-text-muted/70 mt-1 block text-right">10:45 AM</span>
              </div>
            </div>

            {/* No reply indicator */}
            <div className="flex justify-center">
              <span className="text-[10px] text-text-muted bg-background px-3 py-1 rounded-full">
                Customer hasn't replied
              </span>
            </div>
          </div>

          {/* Time elapsed badge */}
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-xl px-3 py-2">
            <Clock size={14} className="text-accent shrink-0" />
            <span className="text-xs font-bold text-accent">2 days ago</span>
            <span className="text-xs text-text-muted">·</span>
            <span className="text-xs font-mono font-bold text-text-primary">₦60,000</span>
            <span className="text-xs text-text-muted">opportunity</span>
          </div>

          {/* Sabi intervention */}
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div
                key="nudge-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-background border border-accent/30 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                    <span className="text-accent font-black text-[10px]">S</span>
                  </div>
                  <span className="text-xs font-bold text-text-primary">Sabi</span>
                </div>

                <p className="text-sm text-text-muted leading-relaxed">
                  This customer hasn't replied. Want to follow up?
                </p>

                <div className="bg-surface-2 rounded-xl p-3 border border-white/5">
                  <p className="text-xs text-text-primary leading-relaxed italic">
                    "Hi! Just checking in on the burgundy lace — 5 yards at ₦60,000. Still interested? I can hold it for you today 😊"
                  </p>
                </div>

                <button
                  onClick={handleFollowUp}
                  className="w-full bg-accent-whatsapp text-background font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
                >
                  <ExternalLink size={16} />
                  Send on WhatsApp
                </button>
              </motion.div>
            )}

            {state === 'sent' && (
              <motion.div
                key="sent-confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                  <Check size={18} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Follow-up sent ✓</p>
                  <p className="text-xs text-text-muted">Message opened in WhatsApp, ready to send.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-3 italic">
          Example conversation for demonstration purposes
        </p>
      </div>
    </section>
  )
}

export default ChatSimulator
