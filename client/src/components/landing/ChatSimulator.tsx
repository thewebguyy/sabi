import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, ExternalLink, RotateCcw, MessageSquare } from 'lucide-react'
import { trackEvent } from '../../lib/analytics'

type SimState = 'idle' | 'sent'

const ChatSimulator: React.FC = () => {
  const [state, setState] = useState<SimState>('idle')

  const handleSend = () => {
    trackEvent('simulator_followup_click', { deal_value: 60000 })
    setState('sent')
  }

  const handleReplay = () => {
    trackEvent('simulator_interaction', { action: 'replay' })
    setState('idle')
  }

  return (
    <section className="py-20 px-6 border-t border-[#1C221E]" id="simulator">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial narrative */}
          <div className="lg:col-span-5 space-y-5">
            <p className="editorial-kicker text-accent">Interactive Simulation</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold leading-[1.08] text-text-primary">
              A customer asked about your product. <br />
              <span className="text-text-muted">Then went quiet.</span>
            </h2>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              In Nigerian social commerce, this happens 10 times a day. You got busy attending to other buyers. The chat slipped off your screen. That's a lost sale.
            </p>
            <div className="pt-2 border-t border-[#232B25] space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                  Sabi tracks silence, not just messages
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Try the simulation to see how Sabi turns a dead conversation into an immediate WhatsApp follow-up.
              </p>
            </div>
          </div>

          {/* Right Column: Simulator device/card */}
          <div className="lg:col-span-7">
            <div className="bg-[#121513] rounded-2xl border border-[#232B25] p-5 sm:p-7 shadow-2xl space-y-5">
              {/* WhatsApp chat header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2521]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1E2E24] border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Amaka O.</h3>
                    <p className="text-[11px] font-mono text-text-muted">Active via WhatsApp</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#1F2521] border border-[#2D3630] font-mono text-[11px] text-text-muted">
                  WhatsApp DM
                </span>
              </div>

              {/* Message thread */}
              <div className="space-y-3.5 py-1">
                {/* Incoming buyer message */}
                <div className="flex justify-start">
                  <div className="chat-bubble-incoming">
                    <p>Good afternoon Sis, is the burgundy Swiss lace still available? Need 5 yards for my sister's wedding.</p>
                    <span className="font-mono text-[10px] text-text-muted mt-1.5 block text-right">Tuesday · 2:14 PM</span>
                  </div>
                </div>

                {/* Vendor response */}
                <div className="flex justify-end">
                  <div className="chat-bubble-outgoing">
                    <p>Good afternoon! Yes oh, still available. ₦13,000 per yard. I can do ₦60,000 for 5 yards. Send delivery location so I can dispatch today 🙏</p>
                    <span className="font-mono text-[10px] text-text-muted/80 mt-1.5 block text-right">Tuesday · 2:28 PM</span>
                  </div>
                </div>

                {/* Silence indicator */}
                <div className="py-2 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-[#1B1206] border border-accent/30 rounded-full px-3.5 py-1 text-accent">
                    <Clock size={12} className="shrink-0 animate-pulse" />
                    <span className="font-mono text-[11px] font-bold">2 DAYS QUIET · NO REPLY</span>
                    <span className="text-text-muted">·</span>
                    <span className="font-mono text-[11px] font-bold">₦60,000 OPPORTUNITY</span>
                  </div>
                </div>
              </div>

              {/* Sabi intervention card */}
              <AnimatePresence mode="wait">
                {state === 'idle' ? (
                  <motion.div
                    key="idle-intervention"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-[#0A0D0B] border border-accent/40 rounded-xl p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-accent text-background font-black text-[11px] flex items-center justify-center font-mono">
                          S
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                          Sabi Suggested Follow-Up
                        </span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-accent">₦60,000 OPPORTUNITY</span>
                    </div>

                    <p className="text-xs sm:text-sm text-text-muted">
                      Amaka hasn't replied to your ₦60,000 price quote. Sabi prepared this gentle reminder:
                    </p>

                    <div className="bg-[#141815] border border-white/5 rounded-lg p-3">
                      <p className="text-xs sm:text-[13px] text-text-primary italic leading-relaxed">
                        "Good afternoon Amaka! Just checking in on the burgundy Swiss lace (5 yards) at ₦60,000. Another buyer is asking for the same piece, but wanted to check with you first. Still want it dispatched today? 😊"
                      </p>
                    </div>

                    <button
                      onClick={handleSend}
                      className="w-full bg-[#25D366] text-[#0A0D0B] font-bold py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-[#22c35e] active:scale-[0.98] transition-all shadow-lg"
                    >
                      <ExternalLink size={16} />
                      <span>Send on WhatsApp</span>
                    </button>
                    <p className="text-center font-mono text-[10px] text-text-muted">
                      Opens WhatsApp with the exact customer & message loaded. You tap Send.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sent-confirmation"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-[#0D2418] border border-[#25D366]/40 rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] shrink-0">
                        <Check size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">Follow-up sent via WhatsApp ✓</h4>
                        <p className="text-xs text-text-muted mt-0.5">
                          Message opened in WhatsApp. Customer has been reminded.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-between items-center border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="font-mono text-[11px] text-text-muted">Status: Waiting for customer</span>
                      </div>
                      <button
                        onClick={handleReplay}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text-primary transition-colors py-1 px-2.5 rounded hover:bg-white/5"
                      >
                        <RotateCcw size={13} />
                        <span>Replay Simulator</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-center font-mono text-[10px] text-text-muted">
                DEMONSTRATION ONLY · REAL VENDOR WORKFLOW
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatSimulator
