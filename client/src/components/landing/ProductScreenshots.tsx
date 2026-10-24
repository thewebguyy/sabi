import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, CheckCircle2, XCircle, Copy, ExternalLink, Sparkles, AlertCircle } from 'lucide-react'
import { trackEvent } from '../../lib/analytics'

type TabKey = 'today' | 'followup' | 'capture'

const mockDeals = [
  {
    name: 'Tunde B.',
    product: 'iPhone 13 128GB Blue',
    amount: '₦420,000',
    quiet: 'quiet for 28 hrs',
    constraint: 'Hold till 4pm · Ikeja Computer Village pickup',
    followupDraft:
      'Hi Tunde! Checking in on the blue iPhone 13 (128GB) at ₦420,000. Another buyer is asking at the shop, but keeping it set aside for you first. Still picking up today? 😊',
  },
  {
    name: 'Amaka O.',
    product: 'Burgundy Swiss Lace (5 yds)',
    amount: '₦60,000',
    quiet: 'quiet for 2 days',
    constraint: 'Dispatch to Lekki Phase 1',
    followupDraft:
      'Good afternoon Amaka! Just checking in on the burgundy Swiss lace at ₦60,000. Dispatches for Lekki leave at 2pm. Should I include yours today?',
  },
  {
    name: 'Blessing E.',
    product: '28" Bone Straight Wig',
    amount: '₦185,000',
    quiet: 'quiet for 3 days',
    constraint: 'Waybill to Abuja via Peace Mass',
    followupDraft:
      'Hello Blessing dear! Quick follow-up on your 28" bone straight wig order (₦185,000). Waybill dispatch is heading out shortly. Let me know if you are ready! 💕',
  },
  {
    name: 'Dr. Femi',
    product: 'Small Chops 50-Pack Platter',
    amount: '₦45,000',
    quiet: 'quiet for 48 hrs',
    constraint: 'Surulere clinic Saturday delivery',
    followupDraft:
      'Good afternoon Dr. Femi! Checking in regarding the 50-pack small chops for Saturday (₦45,000). Chef needs to finalize the weekend prep list today. Best regards!',
  },
]

const ProductScreenshots: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('today')
  const [selectedDealIndex, setSelectedDealIndex] = useState(0)

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab)
    trackEvent('product_screenshot_interaction', { tab })
  }

  const activeDeal = mockDeals[selectedDealIndex]

  return (
    <section className="py-20 px-6 border-t border-surface-border" id="product">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <p className="editorial-kicker text-accent">Real Application UI</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-display font-extrabold leading-[1.08] text-text-primary">
            Built from the actual Sabi codebase.
          </h2>
          <p className="text-base text-text-muted">
            No marketing renders or fake mockups. This is the exact layout, typography, and controls you use to recover quiet sales.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-surface border border-surface-border gap-1 shadow-sm">
            <button
              onClick={() => handleTabChange('today')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'today'
                  ? 'bg-accent text-white dark:text-background shadow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Today Queue
            </button>
            <button
              onClick={() => handleTabChange('followup')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'followup'
                  ? 'bg-accent text-white dark:text-background shadow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              1-Tap Follow-Up
            </button>
            <button
              onClick={() => handleTabChange('capture')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'capture'
                  ? 'bg-accent text-white dark:text-background shadow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Paste & Capture
            </button>
          </div>
        </div>

        {/* Phone Frame representation */}
        <div className="max-w-md mx-auto">
          <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden shadow-2xl">
            {/* Phone Top Bar */}
            <div className="bg-surface-2 px-5 py-3 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-accent text-white dark:text-background font-mono font-black text-[10px] flex items-center justify-center">
                  S
                </span>
                <span className="font-display font-extrabold text-xs text-text-primary">
                  Sabi
                </span>
                <span className="text-[10px] font-mono text-text-muted">· Today</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface border border-surface-border px-2 py-0.5 rounded text-[10px] text-accent font-mono">
                <span>₦710,000 ACTIVE</span>
              </div>
            </div>

            {/* Screen Content Switcher */}
            <div className="p-4 sm:p-5 bg-background min-h-[500px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab === 'today' && (
                  <motion.div
                    key="today-view"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="space-y-3"
                  >
                    {/* Header Metric Box */}
                    <div className="bg-surface rounded-2xl border border-surface-border p-4 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-xl pointer-events-none" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">
                        Total Open Value
                      </p>
                      <p className="font-mono text-2xl font-extrabold text-accent">
                        ₦710,000
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">across 4 quiet conversations</p>

                      <div className="mt-3 pt-3 border-t border-surface-border flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          <span className="text-[11px] font-semibold text-text-primary">
                            4 deals need follow-up today
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-accent">+ Quick Paste</span>
                      </div>
                    </div>

                    {/* Deal Cards across Fashion, Tech, Hair, Food */}
                    <div className="space-y-2.5">
                      {mockDeals.map((deal, idx) => (
                        <div
                          key={idx}
                          className="bg-surface border border-surface-border rounded-2xl p-3.5 space-y-2 shadow-sm"
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
                            <div className="flex items-center gap-1.5 bg-surface-2 px-2.5 py-1 rounded-lg border border-surface-border text-[10px] text-text-muted">
                              <AlertCircle size={11} className="text-accent shrink-0" />
                              <span className="truncate">{deal.constraint}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              onClick={() => {
                                setSelectedDealIndex(idx)
                                handleTabChange('followup')
                              }}
                              className="flex-1 bg-[#25D366] text-[#0A0A0A] font-extrabold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(37,211,102,0.15)] active:scale-95 transition-all"
                            >
                              <MessageCircle size={12} />
                              <span>Follow Up ({deal.amount})</span>
                            </button>
                            <button
                              title="Mark Won"
                              className="bg-success/15 text-success border border-success/30 p-2 rounded-xl"
                            >
                              <CheckCircle2 size={13} />
                            </button>
                            <button
                              title="Mark Lost"
                              className="bg-danger/15 text-danger border border-danger/30 p-2 rounded-xl"
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
                    <div className="bg-surface border border-surface-border rounded-2xl p-4 space-y-3.5 shadow-sm">
                      <div className="flex justify-between items-start pb-2.5 border-b border-surface-border">
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">
                            Follow Up with {activeDeal.name}
                          </h4>
                          <p className="text-[10px] text-text-muted mt-0.5">
                            {activeDeal.product} • {activeDeal.amount}
                          </p>
                        </div>
                        <button
                          onClick={() => handleTabChange('today')}
                          className="w-6 h-6 rounded-full bg-surface-2 text-text-muted text-[10px] flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                          Personalized Pre-Composed Message
                        </label>
                        <div className="bg-surface-2 border border-surface-border rounded-xl p-3 text-[11px] text-text-primary leading-relaxed">
                          "{activeDeal.followupDraft}"
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button className="bg-surface-2 text-text-primary font-bold py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 border border-surface-border">
                          <Copy size={12} />
                          <span>Copy Draft</span>
                        </button>
                        <button className="bg-[#25D366] text-[#0A0A0A] font-extrabold py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-md">
                          <ExternalLink size={12} />
                          <span>Open WhatsApp</span>
                        </button>
                      </div>

                      <p className="font-mono text-[9px] text-center text-text-muted">
                        Opens your official WhatsApp with {activeDeal.name}'s chat and message ready.
                      </p>
                    </div>

                    {/* Quick deal selector */}
                    <div className="pt-2 border-t border-surface-border space-y-1.5">
                      <p className="font-mono text-[9px] text-text-muted uppercase tracking-wider">
                        Switch active customer:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {mockDeals.map((d, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedDealIndex(idx)}
                            className={`p-1.5 rounded-lg text-[10px] font-bold text-left border transition-all ${
                              selectedDealIndex === idx
                                ? 'bg-accent/15 border-accent text-accent'
                                : 'bg-surface border-surface-border text-text-muted'
                            }`}
                          >
                            <span className="block truncate">{d.name}</span>
                            <span className="font-mono text-[9px] block opacity-80">{d.amount}</span>
                          </button>
                        ))}
                      </div>
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
                    <div className="bg-surface border border-surface-border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          Fast WhatsApp Paste
                        </span>
                        <span className="text-[9px] font-mono text-accent">5 SECONDS</span>
                      </div>

                      <div className="bg-surface-2 border border-surface-border rounded-xl p-3 font-mono text-[10px] text-text-muted leading-relaxed">
                        [11:04 AM] Tunde: Bro, what's your last price for the clean iPhone 13 128GB blue?<br />
                        [11:15 AM] You: ₦420,000 last with receipt and charger. Can hold it till 4pm.
                      </div>

                      <div className="bg-accent text-white dark:text-background font-extrabold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5">
                        <Sparkles size={13} />
                        <span>Deal Automatically Recognized</span>
                      </div>
                    </div>

                    <div className="bg-surface border border-surface-border rounded-2xl p-3 space-y-2 text-xs shadow-sm">
                      <p className="font-mono text-[9px] font-bold text-success uppercase tracking-wider">
                        ✓ Extracted Fields
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-xl bg-surface-2 border border-surface-border">
                          <p className="font-mono text-[8px] text-text-muted uppercase">Customer</p>
                          <p className="font-bold text-text-primary text-[11px]">Tunde B.</p>
                        </div>
                        <div className="p-2 rounded-xl bg-surface-2 border border-surface-border">
                          <p className="font-mono text-[8px] text-text-muted uppercase">Agreed Price</p>
                          <p className="font-mono font-bold text-accent text-[11px]">₦420,000</p>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-surface-2 border border-surface-border">
                        <p className="font-mono text-[8px] text-text-muted uppercase">Product</p>
                        <p className="font-bold text-text-primary text-[11px]">Refurbished iPhone 13 (128GB Blue)</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom annotation */}
              <div className="pt-3 border-t border-surface-border text-center">
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
