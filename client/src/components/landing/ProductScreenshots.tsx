import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, CheckCircle2, XCircle, Copy, ExternalLink, Sparkles, Clipboard, Clock, AlertCircle } from 'lucide-react'
import { trackEvent } from '../../lib/analytics'

type TabKey = 'today' | 'followup' | 'capture'

const ProductScreenshots: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('today')

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab)
    trackEvent('product_screenshot_interaction', { tab })
  }

  return (
    <section className="py-20 px-6 border-t border-[#1C221E]" id="product">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <p className="editorial-kicker text-accent">Real Application UI</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-display font-extrabold leading-[1.08] text-text-primary">
            Built from the actual Sabi codebase.
          </h2>
          <p className="text-base text-text-muted">
            No marketing renders or exaggerated concepts. This is the exact layout, tokens, and controls you use inside the app.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-[#121513] border border-[#232B25] gap-1">
            <button
              onClick={() => handleTabChange('today')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'today'
                  ? 'bg-accent text-background shadow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Today Queue
            </button>
            <button
              onClick={() => handleTabChange('followup')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'followup'
                  ? 'bg-accent text-background shadow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              1-Tap Follow-Up
            </button>
            <button
              onClick={() => handleTabChange('capture')}
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

        {/* Phone Frame representation */}
        <div className="max-w-md mx-auto">
          <div className="bg-[#121513] rounded-2xl border border-[#232B25] overflow-hidden shadow-2xl">
            {/* Phone Top Bar */}
            <div className="bg-[#0A0D0B] px-5 py-3 border-b border-[#1F2521] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-accent text-background font-mono font-black text-[10px] flex items-center justify-center">
                  S
                </span>
                <span className="font-display font-extrabold text-xs text-text-primary">
                  Sabi
                </span>
                <span className="text-[10px] font-mono text-text-muted">· Today</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#171C19] border border-white/5 px-2 py-0.5 rounded text-[10px] text-accent font-mono">
                <span>4 DEALS</span>
              </div>
            </div>

            {/* Screen Content Switcher */}
            <div className="p-4 sm:p-5 bg-[#0A0D0B] min-h-[480px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab === 'today' && (
                  <motion.div
                    key="today-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="space-y-3"
                  >
                    {/* Header Metric Box (matches Today.tsx exactly) */}
                    <div className="bg-[#141414] rounded-2xl border border-[#262626] p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-xl pointer-events-none" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">
                        Total Open Value
                      </p>
                      <p className="font-mono text-2xl font-extrabold text-accent">
                        ₦385,000
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">in open opportunities</p>

                      <div className="mt-3 pt-3 border-t border-[#262626] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          <span className="text-[11px] font-semibold text-text-primary">
                            4 conversations need attention
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-accent">+ Capture</span>
                      </div>
                    </div>

                    {/* Deal Cards (matches Today.tsx deal row structure) */}
                    <div className="space-y-2.5">
                      {[
                        {
                          name: 'Amaka O.',
                          product: 'Burgundy Lace (5 yds)',
                          amount: '₦60,000',
                          quiet: 'quiet for 2 days',
                          constraint: 'Deliver to Lekki Phase 1',
                        },
                        {
                          name: 'Chidera K.',
                          product: 'Swiss Voile Bundle',
                          amount: '₦145,000',
                          quiet: 'quiet for 3 days',
                          constraint: 'Waiting for account details',
                        },
                        {
                          name: 'Funke A.',
                          product: 'Ankara Wedding Set',
                          amount: '₦180,000',
                          quiet: 'quiet for 5 days',
                          constraint: '',
                        },
                      ].map((deal, idx) => (
                        <div
                          key={idx}
                          className="bg-[#141414] border border-[#262626] rounded-2xl p-3.5 space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-text-primary">{deal.name}</span>
                                <span className="text-[9px] font-semibold bg-accent/15 text-accent px-1.5 py-0.5 rounded-full border border-accent/30 font-mono">
                                  {deal.quiet}
                                </span>
                              </div>
                              <p className="text-[10px] text-text-muted mt-0.5">{deal.product}</p>
                            </div>
                            <span className="font-mono text-xs font-bold text-accent">
                              {deal.amount}
                            </span>
                          </div>

                          {deal.constraint && (
                            <div className="flex items-center gap-1.5 bg-[#0A0A0A] px-2.5 py-1 rounded-lg border border-[#262626] text-[10px] text-text-muted">
                              <AlertCircle size={11} className="text-accent shrink-0" />
                              <span className="truncate">{deal.constraint}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              onClick={() => handleTabChange('followup')}
                              className="flex-1 bg-[#25D366] text-[#0A0A0A] font-extrabold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(37,211,102,0.15)] active:scale-95 transition-all"
                            >
                              <MessageCircle size={12} />
                              <span>Follow Up</span>
                            </button>
                            <button
                              title="Mark Won"
                              className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 p-2 rounded-xl"
                            >
                              <CheckCircle2 size={13} />
                            </button>
                            <button
                              title="Mark Lost"
                              className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 p-2 rounded-xl"
                            >
                              <XCircle size={13} />
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
                    {/* Follow-Up Sheet modal representation (matches FollowUpSheet.tsx) */}
                    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 space-y-3.5">
                      <div className="flex justify-between items-start pb-2.5 border-b border-[#262626]">
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Follow Up with Amaka O.</h4>
                          <p className="text-[10px] text-text-muted mt-0.5">Burgundy Lace (5 yds) • ₦60,000</p>
                        </div>
                        <span className="w-6 h-6 rounded-full bg-[#1F1F1F] text-text-muted text-[10px] flex items-center justify-center">
                          ✕
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                          Suggested Message
                        </label>
                        <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 text-[11px] text-text-primary leading-relaxed">
                          "Hi Amaka! Just checking in on your order for Burgundy Lace (5 yds) at ₦60,000. Let me know if you are still taking it so I can reserve it for you today! 😊"
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button className="bg-[#1F1F1F] text-text-primary font-bold py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5">
                          <Copy size={12} />
                          <span>Copy Text</span>
                        </button>
                        <button className="bg-[#25D366] text-[#0A0A0A] font-extrabold py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-md">
                          <ExternalLink size={12} />
                          <span>Open WhatsApp</span>
                        </button>
                      </div>

                      <p className="font-mono text-[9px] text-center text-text-muted">
                        Opens your regular WhatsApp with Amaka's chat and message ready.
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
                    {/* Capture Screen representation (matches Capture.tsx) */}
                    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          Fast Paste
                        </span>
                        <span className="text-[9px] font-mono text-accent">5 SECONDS</span>
                      </div>

                      <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 font-mono text-[10px] text-text-muted leading-relaxed">
                        [10:32 AM] Amaka: Hi Sis, is the burgundy lace available? 5 yards.<br />
                        [10:45 AM] You: Yes oh! ₦60,000 total for 5 yards. Send your address.
                      </div>

                      <div className="bg-accent text-background font-extrabold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5">
                        <Sparkles size={13} />
                        <span>Deal Details Extracted</span>
                      </div>
                    </div>

                    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-3 space-y-2 text-xs">
                      <p className="font-mono text-[9px] font-bold text-[#10B981] uppercase tracking-wider">
                        ✓ Extracted Fields
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-xl bg-[#0A0A0A] border border-[#262626]">
                          <p className="font-mono text-[8px] text-text-muted uppercase">Customer</p>
                          <p className="font-bold text-text-primary text-[11px]">Amaka O.</p>
                        </div>
                        <div className="p-2 rounded-xl bg-[#0A0A0A] border border-[#262626]">
                          <p className="font-mono text-[8px] text-text-muted uppercase">Agreed Price</p>
                          <p className="font-mono font-bold text-accent text-[11px]">₦60,000</p>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#0A0A0A] border border-[#262626]">
                        <p className="font-mono text-[8px] text-text-muted uppercase">Product</p>
                        <p className="font-bold text-text-primary text-[11px]">Burgundy Lace (5 yds)</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom annotation */}
              <div className="pt-3 border-t border-[#1F2521] text-center">
                <span className="font-mono text-[9px] text-text-muted">
                  ACTUAL SABI INTERFACE TOKENS · RUNS IN MOBILE BROWSER
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
