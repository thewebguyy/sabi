import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, CheckCircle2, Copy, ExternalLink, Sparkles, Clipboard, Clock } from 'lucide-react'

type TabKey = 'today' | 'followup' | 'capture'

const ProductScreenshots: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('today')

  return (
    <section className="py-20 px-6 border-t border-[#1C221E]" id="product">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <p className="editorial-kicker text-accent">Actual Product Interface</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-display font-extrabold leading-[1.08] text-text-primary">
            This is what Sabi <br />
            <span className="text-accent">actually looks like.</span>
          </h2>
          <p className="text-base text-text-muted">
            No mockups or concept art. This is the exact web interface you will use on your phone.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-[#121513] border border-[#232B25] gap-1">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'today'
                  ? 'bg-accent text-background shadow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Today Queue
            </button>
            <button
              onClick={() => setActiveTab('followup')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'followup'
                  ? 'bg-accent text-background shadow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              1-Tap Follow-Up
            </button>
            <button
              onClick={() => setActiveTab('capture')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'capture'
                  ? 'bg-accent text-background shadow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Paste & Capture
            </button>
          </div>
        </div>

        {/* Display Frame */}
        <div className="max-w-md mx-auto">
          <div className="bg-[#121513] rounded-2xl border border-[#232B25] overflow-hidden shadow-2xl">
            {/* Top Phone Chrome */}
            <div className="bg-[#0A0D0B] px-5 py-3 border-b border-[#1F2521] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-accent text-background font-mono font-black text-[10px] flex items-center justify-center">
                  S
                </span>
                <span className="font-display font-extrabold text-xs text-text-primary">
                  sabi.app
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[10px] text-text-muted">LIVE DEMO</span>
              </div>
            </div>

            {/* Screen Content Switcher */}
            <div className="p-4 sm:p-5 bg-[#0A0D0B] min-h-[460px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab === 'today' && (
                  <motion.div
                    key="today-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="space-y-3"
                  >
                    {/* Header summary */}
                    <div className="bg-[#121513] rounded-xl border border-[#232B25] p-4 relative overflow-hidden">
                      <p className="editorial-kicker text-text-muted mb-1">TOTAL OPEN MONEY</p>
                      <p className="font-mono text-3xl font-extrabold text-accent">₦385,000</p>
                      <div className="mt-3 pt-2.5 border-t border-[#1F2521] flex items-center gap-2">
                        <Clock size={13} className="text-accent" />
                        <span className="text-xs font-semibold text-text-primary">
                          3 deals need follow-up today
                        </span>
                      </div>
                    </div>

                    {/* Deal rows */}
                    <div className="space-y-2">
                      {[
                        {
                          name: 'Amaka O.',
                          item: 'Burgundy Lace (5 yds)',
                          amount: '₦60,000',
                          quiet: '2 days quiet',
                          urgent: true,
                        },
                        {
                          name: 'Chidera K.',
                          item: 'Swiss Voile Bundle',
                          amount: '₦145,000',
                          quiet: '3 days quiet',
                          urgent: true,
                        },
                        {
                          name: 'Funke A.',
                          item: 'Ankara Wedding Set',
                          amount: '₦180,000',
                          quiet: '5 days quiet',
                          urgent: false,
                        },
                      ].map((deal, idx) => (
                        <div
                          key={idx}
                          className="bg-[#121513] rounded-xl border border-[#232B25] p-3 space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-text-primary">{deal.name}</span>
                                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#1A1810] border border-accent/30 text-accent">
                                  {deal.quiet}
                                </span>
                              </div>
                              <p className="text-[11px] text-text-muted mt-0.5">{deal.item}</p>
                            </div>
                            <span className="font-mono text-xs font-bold text-accent">
                              {deal.amount}
                            </span>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => setActiveTab('followup')}
                              className="flex-1 bg-[#25D366] text-[#0A0D0B] font-bold py-1.5 px-3 rounded text-[11px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                            >
                              <MessageCircle size={12} />
                              <span>Follow Up</span>
                            </button>
                            <button className="px-2 py-1.5 rounded bg-[#1A261E] border border-[#25D366]/30 text-[#25D366] text-[11px] flex items-center justify-center">
                              <CheckCircle2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'followup' && (
                  <motion.div
                    key="followup-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="space-y-4"
                  >
                    <div className="bg-[#121513] rounded-xl border border-[#232B25] p-4 space-y-3">
                      <div className="flex justify-between items-start pb-2 border-b border-[#1F2521]">
                        <div>
                          <p className="text-xs font-bold text-text-primary">Follow-Up Sheet</p>
                          <p className="text-[11px] text-text-muted">Amaka O. · Burgundy Lace</p>
                        </div>
                        <span className="font-mono text-xs font-bold text-accent">₦60,000</span>
                      </div>

                      <div className="space-y-1.5">
                        <p className="editorial-kicker text-text-muted">SUGGESTED WHATSAPP MESSAGE</p>
                        <div className="bg-[#0A0D0B] border border-white/5 rounded-lg p-3">
                          <p className="text-xs text-text-primary leading-relaxed italic">
                            "Good afternoon Amaka! Just checking in on the burgundy Swiss lace (5 yards) at ₦60,000. Another buyer is asking for the bundle, but I kept it aside for you first. Let me know if you still want it today 😊"
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button className="py-2.5 px-3 rounded-lg bg-[#1F2521] border border-white/5 text-text-primary font-bold text-xs flex items-center justify-center gap-1.5">
                          <Copy size={13} />
                          <span>Copy Message</span>
                        </button>
                        <button className="py-2.5 px-3 rounded-lg bg-[#25D366] text-[#0A0D0B] font-bold text-xs flex items-center justify-center gap-1.5">
                          <ExternalLink size={13} />
                          <span>Open WhatsApp</span>
                        </button>
                      </div>

                      <p className="font-mono text-[10px] text-center text-text-muted pt-1">
                        Opens your WhatsApp app with text pre-filled.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'capture' && (
                  <motion.div
                    key="capture-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="space-y-3"
                  >
                    <div className="bg-[#121513] rounded-xl border border-[#232B25] p-3 space-y-2">
                      <div className="flex items-center gap-2 text-accent">
                        <Clipboard size={14} />
                        <span className="text-xs font-bold">Paste Raw WhatsApp Text</span>
                      </div>
                      <div className="bg-[#0A0D0B] border border-[#1F2521] rounded-lg p-2.5 font-mono text-[10px] text-text-muted leading-relaxed">
                        [10:32 AM] Amaka: Is the burgundy lace available? 5 yards.<br />
                        [10:45 AM] You: Yes, ₦60,000 total for 5 yards. Send address.
                      </div>
                    </div>

                    <div className="bg-accent text-background font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5">
                      <Sparkles size={13} />
                      <span>Deal Extracted in 1 Second</span>
                    </div>

                    <div className="bg-[#121513] rounded-xl border border-[#232B25] p-3 space-y-2">
                      <p className="font-mono text-[10px] font-bold text-[#25D366] uppercase tracking-wider">
                        ✓ Extracted Fields
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-[#0A0D0B] border border-white/5">
                          <p className="font-mono text-[9px] text-text-muted uppercase">Customer</p>
                          <p className="font-bold text-text-primary">Amaka O.</p>
                        </div>
                        <div className="p-2 rounded bg-[#0A0D0B] border border-white/5">
                          <p className="font-mono text-[9px] text-text-muted uppercase">Deal Amount</p>
                          <p className="font-mono font-bold text-accent">₦60,000</p>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-[#0A0D0B] border border-white/5 text-xs">
                        <p className="font-mono text-[9px] text-text-muted uppercase">Item</p>
                        <p className="font-bold text-text-primary">Burgundy Lace (5 yards)</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom annotation */}
              <div className="pt-3 border-t border-[#1F2521] text-center">
                <span className="font-mono text-[10px] text-text-muted">
                  ILLUSTRATIVE MERCHANT DEMO · RUNS IN MOBILE BROWSER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductScreenshots
