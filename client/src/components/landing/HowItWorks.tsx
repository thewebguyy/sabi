import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Copy, Sparkles, Check, Clock, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react'
import { trackEvent } from '../../lib/analytics'

const steps = [
  {
    step: '01',
    kicker: 'CAPTURE IN SECONDS',
    title: 'Paste or share a WhatsApp chat',
    description:
      'Copy the chat text from WhatsApp and tap paste in Sabi. Takes 5 seconds. No complex CRM forms, no contact database setup.',
    detail: 'Customer name, product description, and agreed amount are instantly detected.',
  },
  {
    step: '02',
    kicker: 'AUTOMATIC TIMER',
    title: 'Sabi tracks the silence',
    description:
      'If the customer has not replied in 24–48 hours, Sabi flags the conversation as an at-risk opportunity on your Today screen.',
    detail: 'Categorizes by Naira value and urgency so you always know who to follow up with first.',
  },
  {
    step: '03',
    kicker: 'ONE-TAP ACTION',
    title: 'Follow up directly in WhatsApp',
    description:
      'Tap Follow Up. Sabi composes a polite, context-aware message and opens your official WhatsApp with the text pre-loaded.',
    detail: 'You review it, hit Send, and keep the sale alive before the customer buys from someone else.',
  },
]

const demoChats = [
  {
    raw: `[11:04 AM] Tunde: Bro, what's your last price for the clean iPhone 13 128GB blue?
[11:15 AM] You: ₦420,000 last with receipt and charger. Can hold it till 4pm.
[11:18 AM] Tunde: Okay bro let me arrange transfer.`,
    extracted: {
      name: 'Tunde B.',
      item: 'iPhone 13 128GB Blue',
      amount: '₦420,000',
      action: 'Hold till 4pm · Transfer pending',
      silence: '28h quiet',
    },
  },
  {
    raw: `[02:14 PM] Amaka: Sis, how much for 5 yards of burgundy Swiss lace? Need it in Lekki on Thursday.
[02:28 PM] You: ₦60,000 for 5 yards dear! Send your delivery street.
[02:30 PM] Amaka: Let me ask my husband and text you back now.`,
    extracted: {
      name: 'Amaka O.',
      item: 'Burgundy Swiss Lace (5 yds)',
      amount: '₦60,000',
      action: 'Lekki Phase 1 delivery',
      silence: '48h quiet',
    },
  },
  {
    raw: `[04:05 PM] Blessing: Sis, do you have 28" double drawn bone straight wig? Can it reach Abuja before Friday?
[04:18 PM] You: Yes babe, 3 bundles + frontal is ₦185,000. Waybill leaves tomorrow.
[04:22 PM] Blessing: Okay wait let me send the money.`,
    extracted: {
      name: 'Blessing E.',
      item: '28" Bone Straight Wig',
      amount: '₦185,000',
      action: 'Abuja Waybill dispatch',
      silence: '3 days quiet',
    },
  },
]

const HowItWorks: React.FC = () => {
  const [activeChatIndex, setActiveChatIndex] = useState(0)
  const [animStage, setAnimStage] = useState<'copy' | 'parse' | 'card'>('copy')

  useEffect(() => {
    // 3-stage loop: 0s Copy -> 1.8s Parse -> 3.6s Card -> 6.5s Next Chat
    const timer1 = setTimeout(() => setAnimStage('parse'), 1600)
    const timer2 = setTimeout(() => setAnimStage('card'), 3200)
    const timer3 = setTimeout(() => {
      setAnimStage('copy')
      setActiveChatIndex((prev) => (prev + 1) % demoChats.length)
    }, 6500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [activeChatIndex])

  const currentDemo = demoChats[activeChatIndex]

  return (
    <section className="py-20 px-6 border-t border-surface-border" id="how-it-works">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-3">
          <p className="editorial-kicker text-accent">How Sabi Operates</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-display font-extrabold leading-[1.08] text-text-primary max-w-2xl">
            Three steps. Zero forms. <br />
            <span className="text-text-muted opacity-80">No admin work.</span>
          </h2>
          <p className="text-base sm:text-lg text-text-muted max-w-xl">
            You don't need another complex CRM dashboard with 20 input fields. You just need to know which customer owes you a reply.
          </p>
        </div>

        {/* ─── LIVE INTERACTIVE "CHAT-TO-CARD" MAGIC PREVIEW ─── */}
        <div className="bg-surface rounded-3xl border border-surface-border p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-surface-border">
            <div>
              <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                Live Demonstration · Step 01 Magic
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary mt-1">
                From Messy WhatsApp Chat to Money-Tracking Card
              </h3>
            </div>

            {/* Stage indicator pills */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                  animStage === 'copy'
                    ? 'bg-accent text-white dark:text-background shadow-md'
                    : 'bg-surface-2 text-text-muted border border-surface-border'
                }`}
              >
                <span>1. Copy Chat</span>
              </div>
              <ArrowRight size={12} className="text-text-muted" />
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                  animStage === 'parse'
                    ? 'bg-accent text-white dark:text-background shadow-md'
                    : 'bg-surface-2 text-text-muted border border-surface-border'
                }`}
              >
                <span>2. Instant Parse</span>
              </div>
              <ArrowRight size={12} className="text-text-muted" />
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                  animStage === 'card'
                    ? 'bg-accent-whatsapp text-white shadow-md'
                    : 'bg-surface-2 text-text-muted border border-surface-border'
                }`}
              >
                <span>3. Tracked Card</span>
              </div>
            </div>
          </div>

          {/* Interactive Split Visual: Left Raw WhatsApp -> Right Auto-Generated Card */}
          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            {/* Raw WhatsApp Chat Box */}
            <div className="md:col-span-6 bg-surface-2 rounded-2xl border border-surface-border p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-whatsapp" />
                  <span className="font-mono text-xs font-bold text-text-primary">WhatsApp Message Selection</span>
                </div>
                <span className="font-mono text-[10px] text-text-muted bg-surface px-2 py-0.5 rounded border border-surface-border">
                  Raw Chat
                </span>
              </div>

              {/* Chat snippet */}
              <div className="bg-surface rounded-xl p-3 border border-surface-border font-mono text-xs sm:text-[13px] text-text-primary leading-relaxed whitespace-pre-line relative shadow-sm">
                {currentDemo.raw}
                {animStage === 'copy' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-accent/15 border-2 border-accent rounded-xl flex items-center justify-center backdrop-blur-[1px]"
                  >
                    <div className="bg-surface text-accent font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 text-xs border border-accent/40">
                      <Copy size={13} />
                      <span>Copied to Clipboard</span>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-2 border-t border-surface-border">
                <span>No formatting needed</span>
                <span className="text-accent font-bold">Takes 3 seconds</span>
              </div>
            </div>

            {/* Converted Sabi Card */}
            <div className="md:col-span-6 bg-surface-2 rounded-2xl border border-accent/30 p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-accent text-white dark:text-background font-mono font-black text-[10px] flex items-center justify-center">
                    S
                  </span>
                  <span className="font-display font-bold text-xs text-text-primary">
                    Sabi Auto-Extracted Deal
                  </span>
                </div>
                <span className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded font-bold">
                  {currentDemo.extracted.silence}
                </span>
              </div>

              {/* Card representation */}
              <AnimatePresence mode="wait">
                {animStage === 'copy' ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center space-y-2 text-text-muted">
                    <Clock size={20} className="animate-spin text-accent" />
                    <p className="font-mono text-xs">Waiting for copied text...</p>
                  </div>
                ) : (
                  <motion.div
                    key={`${activeChatIndex}-card`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-text-primary text-base">
                          {currentDemo.extracted.name}
                        </h4>
                        <p className="text-xs text-text-muted mt-0.5">
                          {currentDemo.extracted.item}
                        </p>
                      </div>
                      <span className="font-mono text-base font-extrabold text-accent">
                        {currentDemo.extracted.amount}
                      </span>
                    </div>

                    <div className="bg-surface rounded-lg p-2.5 border border-surface-border flex items-center justify-between text-xs shadow-sm">
                      <span className="text-text-muted truncate">
                        {currentDemo.extracted.action}
                      </span>
                      <span className="font-mono text-[10px] text-accent-whatsapp font-bold shrink-0 ml-2">
                        ✓ Extracted
                      </span>
                    </div>

                    <div className="w-full bg-[#25D366] text-[#0A0D0B] font-extrabold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm">
                      <MessageSquare size={13} />
                      <span>Ready for 1-Tap WhatsApp Follow-Up</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-2 border-t border-surface-border">
                <span className="flex items-center gap-1.5 text-text-primary">
                  <ShieldCheck size={13} className="text-accent-whatsapp" />
                  Zero Meta API / Ban-Safe
                </span>
                <span className="text-accent font-bold">Automatic Timer Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-surface rounded-2xl border border-surface-border p-6 flex flex-col justify-between hover:border-accent/40 transition-all group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-border">
                  <span className="font-mono text-2xl font-bold text-accent">
                    {s.step}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider px-2 py-0.5 rounded bg-surface-2 border border-surface-border">
                    {s.kicker}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-display font-bold text-text-primary mb-3 leading-snug group-hover:text-accent transition-colors">
                  {s.title}
                </h3>

                <p className="text-sm text-text-muted leading-relaxed mb-4">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 border-t border-surface-border">
                <p className="font-mono text-xs text-text-muted leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Direct vendor takeaway */}
        <div className="p-4 sm:p-5 rounded-xl bg-surface-2 border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-whatsapp shrink-0" />
            <p className="text-xs sm:text-sm text-text-primary font-medium">
              No Meta account connection or QR code required. Works with regular WhatsApp and WhatsApp Business.
            </p>
          </div>
          <a
            href="#simulator"
            className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline shrink-0"
          >
            <span>Test the Follow-Up Generator</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
