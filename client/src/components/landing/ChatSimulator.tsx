import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, ExternalLink, RotateCcw, MessageSquare, ShoppingBag, Smartphone, Sparkles, Utensils } from 'lucide-react'
import { trackEvent } from '../../lib/analytics'

type SimState = 'idle' | 'sent'
type VerticalKey = 'lace' | 'phone' | 'wig' | 'chops'

interface Scenario {
  id: VerticalKey
  label: string
  icon: React.ReactNode
  buyerName: string
  product: string
  amount: string
  amountNum: number
  location: string
  incomingText: string
  incomingTime: string
  outgoingText: string
  outgoingTime: string
  quietDuration: string
  suggestedDraft: string
}

const scenarios: Record<VerticalKey, Scenario> = {
  lace: {
    id: 'lace',
    label: 'Fashion & Lace',
    icon: <ShoppingBag size={13} />,
    buyerName: 'Amaka O.',
    product: 'Burgundy Swiss Lace (5 yards)',
    amount: '₦60,000',
    amountNum: 60000,
    location: 'Lekki Phase 1',
    incomingText: "Good afternoon Sis, is the burgundy Swiss lace still available? Need 5 yards for my sister's wedding.",
    incomingTime: 'Tuesday · 2:14 PM',
    outgoingText: "Good afternoon! Yes oh, still available. ₦13,000 per yard, but I can do ₦60,000 for 5 yards. Send delivery location so I can dispatch today 🙏",
    outgoingTime: 'Tuesday · 2:28 PM',
    quietDuration: '2 DAYS QUIET · NO REPLY',
    suggestedDraft: "Good afternoon Amaka! Just checking in on the burgundy Swiss lace (5 yards) at ₦60,000. Another customer is asking for the bundle, but I kept it aside for you first. Still want it dispatched to Lekki today? 😊",
  },
  phone: {
    id: 'phone',
    label: 'Phones & Gadgets',
    icon: <Smartphone size={13} />,
    buyerName: 'Tunde B.',
    product: 'Refurbished iPhone 13 (128GB Blue)',
    amount: '₦420,000',
    amountNum: 420000,
    location: 'Computer Village Pickup',
    incomingText: 'Bro, what is the best price for the clean blue iPhone 13 128GB? Battery health still 88%?',
    incomingTime: 'Yesterday · 11:20 AM',
    outgoingText: 'Boss, factory unlocked, clean neat condition with receipt. Best I can do is ₦420,000 cash or transfer. Can you pick up at Ikeja shop before 5pm?',
    outgoingTime: 'Yesterday · 11:42 AM',
    quietDuration: '28 HOURS QUIET · NO REPLY',
    suggestedDraft: "Hey boss Tunde! Following up on the blue iPhone 13 (128GB, 88% BH) at ₦420,000. Still holding it with the original charger for you at the shop. Coming by today?",
  },
  wig: {
    id: 'wig',
    label: 'Hair & Beauty',
    icon: <Sparkles size={13} />,
    buyerName: 'Blessing E.',
    product: '28-inch Bone Straight 3-Bundle',
    amount: '₦185,000',
    amountNum: 185000,
    location: 'Abuja Waybill',
    incomingText: 'Hello babe! Do you have 28" double drawn bone straight in stock? Can it reach Abuja before Friday?',
    incomingTime: 'Monday · 4:05 PM',
    outgoingText: 'Hey babe! Yes, silky 100% human hair. 3 bundles + HD frontal is ₦185,000. If you pay now, Peace Mass Transit waybill will deliver by Thursday morning.',
    outgoingTime: 'Monday · 4:18 PM',
    quietDuration: '3 DAYS QUIET · NO REPLY',
    suggestedDraft: "Hello Blessing dear! Quick check on your 28\" bone straight wig order (₦185,000). Waybill dispatch to Abuja leaves at 2pm today. Should I seal yours into this batch? 💕",
  },
  chops: {
    id: 'chops',
    label: 'Food & Catering',
    icon: <Utensils size={13} />,
    buyerName: 'Dr. Femi',
    product: 'Small Chops 50-Pack Party Platter',
    amount: '₦45,000',
    amountNum: 45000,
    location: 'Surulere Delivery',
    incomingText: 'Good day. We need 50 packs of spring rolls, samosa, and peppered gizzard for our clinic staff celebration on Saturday.',
    incomingTime: 'Wednesday · 9:15 AM',
    outgoingText: 'Good day Dr. Femi! We can definitely handle 50 packs freshly prepared on Saturday morning. Total is ₦45,000 including dispatch to Surulere.',
    outgoingTime: 'Wednesday · 9:35 AM',
    quietDuration: '48 HOURS QUIET · NO CONFIRMATION',
    suggestedDraft: "Good afternoon Dr. Femi! Checking in regarding the 50-pack small chops platter for Saturday's clinic event (₦45,000). Chef needs ingredient prep confirmation today to lock your delivery slot. Warm regards!",
  },
}

const ChatSimulator: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState<VerticalKey>('lace')
  const [state, setState] = useState<SimState>('idle')

  const current = scenarios[activeVertical]

  const handleSelectVertical = (key: VerticalKey) => {
    setActiveVertical(key)
    setState('idle')
    trackEvent('simulator_vertical_change', { vertical: key })
  }

  const handleSend = () => {
    trackEvent('simulator_followup_click', {
      vertical: activeVertical,
      deal_value: current.amountNum,
    })
    setState('sent')
  }

  const handleReplay = () => {
    trackEvent('simulator_interaction', { action: 'replay', vertical: activeVertical })
    setState('idle')
  }

  return (
    <section className="py-20 px-6 border-t border-surface-border transition-colors" id="simulator">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial narrative */}
          <div className="lg:col-span-5 space-y-5">
            <p className="editorial-kicker text-accent">Interactive Simulation</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold leading-[1.08] text-text-primary">
              A customer asked about your product. <br />
              <span className="text-text-muted opacity-80">Then went quiet.</span>
            </h2>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              In Nigerian social commerce, this happens 10 to 40 times every single day. You got busy attending to walk-ins or packaging dispatch. The chat slipped off your screen. That is a lost sale.
            </p>

            {/* Vertical Switcher Tabs */}
            <div className="space-y-2 pt-2">
              <p className="font-mono text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Select your commerce vertical:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(scenarios) as VerticalKey[]).map((key) => {
                  const s = scenarios[key]
                  const isActive = activeVertical === key
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectVertical(key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border text-left ${
                        isActive
                          ? 'bg-accent/15 border-accent text-accent shadow-sm'
                          : 'bg-surface border-surface-border text-text-muted hover:text-text-primary hover:border-accent/40'
                      }`}
                    >
                      <span className={isActive ? 'text-accent' : 'text-text-muted'}>
                        {s.icon}
                      </span>
                      <span className="truncate">{s.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                  Sabi tracks silence, not just messages
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Try the simulation below to see how Sabi turns a stalled {current.label.toLowerCase()} inquiry into an immediate, polite WhatsApp follow-up.
              </p>
            </div>
          </div>

          {/* Right Column: Simulator device/card */}
          <div className="lg:col-span-7">
            <div className="bg-surface rounded-2xl border border-surface-border p-5 sm:p-7 shadow-xl space-y-5">
              {/* WhatsApp chat header */}
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-whatsapp/15 border border-accent-whatsapp/30 flex items-center justify-center text-accent-whatsapp">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{current.buyerName}</h3>
                    <p className="text-[11px] font-mono text-text-muted">Active via WhatsApp · {current.location}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-surface-2 border border-surface-border font-mono text-[11px] text-accent font-bold">
                  {current.amount}
                </span>
              </div>

              {/* Message thread */}
              <div className="space-y-3.5 py-1">
                {/* Incoming buyer message */}
                <div className="flex justify-start">
                  <div className="chat-bubble-incoming shadow-sm">
                    <p>{current.incomingText}</p>
                    <span className="font-mono text-[10px] text-text-muted mt-1.5 block text-right">
                      {current.incomingTime}
                    </span>
                  </div>
                </div>

                {/* Vendor response */}
                <div className="flex justify-end">
                  <div className="chat-bubble-outgoing shadow-sm">
                    <p>{current.outgoingText}</p>
                    <span className="font-mono text-[10px] opacity-75 mt-1.5 block text-right">
                      {current.outgoingTime}
                    </span>
                  </div>
                </div>

                {/* Silence indicator */}
                <div className="py-2 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-3.5 py-1 text-accent shadow-sm">
                    <Clock size={12} className="shrink-0 animate-pulse" />
                    <span className="font-mono text-[11px] font-bold">{current.quietDuration}</span>
                    <span className="text-text-muted">·</span>
                    <span className="font-mono text-[11px] font-bold">{current.amount} OPPORTUNITY</span>
                  </div>
                </div>
              </div>

              {/* Sabi intervention card */}
              <AnimatePresence mode="wait">
                {state === 'idle' ? (
                  <motion.div
                    key={`${activeVertical}-idle`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-surface-2 border border-accent/40 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-accent text-white dark:text-background font-black text-[11px] flex items-center justify-center font-mono">
                          S
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                          Sabi Suggested Follow-Up
                        </span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-accent">
                        {current.amount} AT RISK
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-text-muted">
                      {current.buyerName} hasn't responded to your price quote. Sabi composed this personalized reminder:
                    </p>

                    <div className="bg-surface border border-surface-border rounded-lg p-3">
                      <p className="text-xs sm:text-[13px] text-text-primary italic leading-relaxed">
                        "{current.suggestedDraft}"
                      </p>
                    </div>

                    <button
                      onClick={handleSend}
                      className="w-full bg-[#25D366] text-[#0A0D0B] font-bold py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-[#22c35e] active:scale-[0.98] transition-all shadow-md"
                    >
                      <ExternalLink size={16} />
                      <span>Send Follow-Up on WhatsApp ({current.amount})</span>
                    </button>
                    <p className="text-center font-mono text-[10px] text-text-muted">
                      Opens WhatsApp with {current.buyerName}'s chat and message loaded. You tap Send.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${activeVertical}-sent`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-accent-whatsapp/10 border border-accent-whatsapp/40 rounded-xl p-5 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-whatsapp/20 flex items-center justify-center text-accent-whatsapp shrink-0">
                        <Check size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">
                          Follow-up dispatched to {current.buyerName} ({current.amount}) ✓
                        </h4>
                        <p className="text-xs text-text-muted mt-0.5">
                          Message opened in WhatsApp. Customer has been politely nudged before buying elsewhere.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-between items-center border-t border-surface-border">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="font-mono text-[11px] text-text-muted">
                          Status: Awaiting reply ({current.amount})
                        </span>
                      </div>
                      <button
                        onClick={handleReplay}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-text-primary transition-colors py-1 px-2.5 rounded hover:bg-surface-2"
                      >
                        <RotateCcw size={13} />
                        <span>Try Another Message</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-center font-mono text-[10px] text-text-muted">
                DEMONSTRATION ONLY · REAL NIGERIAN SOCIAL COMMERCE WORKFLOW
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatSimulator
