import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ExternalLink, 
  Copy,
  TrendingDown,
  ChevronRight,
  Flame,
  AlertTriangle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'

interface LiveDeal {
  id: string
  name: string
  location: string
  product: string
  amount: string
  amountNum: number
  quietTime: string
  chatPreview: string
  followupDraft: string
  category: 'Tech' | 'Fashion' | 'Beauty' | 'Catering'
}

const liveDeals: LiveDeal[] = [
  {
    id: 'deal-1',
    name: 'Tunde B.',
    location: 'Ikeja Computer Village',
    product: 'Refurbished iPhone 13 128GB',
    amount: '₦420,000',
    amountNum: 420000,
    quietTime: '28h quiet',
    chatPreview: 'Bro, let me arrange transfer for the clean blue iPhone 13.',
    followupDraft: 'Hey Tunde! Still holding the blue iPhone 13 at the shop with the original receipt for you. Let me know if picking up today 😊',
    category: 'Tech'
  },
  {
    id: 'deal-2',
    name: 'Amaka O.',
    location: 'Lekki Phase 1',
    product: 'Burgundy Swiss Lace (5 yds)',
    amount: '₦60,000',
    amountNum: 60000,
    quietTime: '48h quiet',
    chatPreview: 'Sis, need 5 yards for my sisters wedding. Dispatch to Lekki?',
    followupDraft: 'Good afternoon Amaka! Just checking in on the burgundy Swiss lace at ₦60,000. Lekki dispatch is leaving at 2pm today 💕',
    category: 'Fashion'
  },
  {
    id: 'deal-3',
    name: 'Blessing E.',
    location: 'Abuja Waybill',
    product: '28" Bone Straight 3-Bundle',
    amount: '₦185,000',
    amountNum: 185000,
    quietTime: '3 days quiet',
    chatPreview: 'Okay babe, let me send the money for the 28" straight wig.',
    followupDraft: 'Hello Blessing dear! Quick check on your 28" wig order. The Abuja Peace Mass waybill leaves in 1 hour. Should I add yours?',
    category: 'Beauty'
  }
]

export const HeroVisualAnchor: React.FC = () => {
  const [activeDealIndex, setActiveDealIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [recoveredCount, setRecoveredCount] = useState(148)

  const activeDeal = liveDeals[activeDealIndex]

  // Auto-cycle through deals every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDealIndex((prev) => (prev + 1) % liveDeals.length)
      setCopied(false)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const handleCopy = () => {
    setCopied(true)
    trackEvent('simulator_interaction', { action: 'hero_copy_draft', deal: activeDeal.id })
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="relative">
      {/* Ambient background glow behind device */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-accent/20 via-accent-whatsapp/20 to-accent/20 rounded-[2.5rem] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt pointer-events-none" />

      {/* Main Container Frame */}
      <div className="relative bg-surface rounded-3xl border border-surface-border shadow-2xl p-5 sm:p-6 space-y-4 overflow-hidden">
        
        {/* Top Header Instrumentation: Total Leak vs Recovered */}
        <div className="flex items-center justify-between pb-3.5 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
                LIVE QUEUE · TODAY
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-accent">
                ₦665,000
              </span>
              <span className="text-[11px] font-mono text-danger font-semibold flex items-center gap-0.5">
                <TrendingDown size={11} />
                3 chats quiet
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted block">
              RECOVERED TODAY
            </span>
            <span className="font-mono text-xs font-bold text-accent-whatsapp bg-accent-whatsapp/10 border border-accent-whatsapp/30 px-2.5 py-1 rounded-full inline-block mt-0.5">
              +{recoveredCount} Deals
            </span>
          </div>
        </div>

        {/* Tab Selector: Switch Between Real Merchant Inquiries */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-2 rounded-xl border border-surface-border">
          {liveDeals.map((deal, idx) => {
            const isActive = idx === activeDealIndex
            return (
              <button
                key={deal.id}
                onClick={() => {
                  setActiveDealIndex(idx)
                  setCopied(false)
                }}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center truncate ${
                  isActive
                    ? 'bg-surface text-accent shadow-sm border border-surface-border'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <span>{deal.name.split(' ')[0]}</span>
                <span className="hidden sm:inline font-mono text-[9px] opacity-75 ml-1">
                  ({deal.amount})
                </span>
              </button>
            )
          })}
        </div>

        {/* Active Interactive Deal Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDeal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Deal Snapshot Card */}
            <div className="bg-surface-2 rounded-2xl border border-accent/40 p-4 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-extrabold text-base text-text-primary">
                      {activeDeal.name}
                    </h3>
                    <span className="font-mono text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-danger/10 border border-danger/30 text-danger flex items-center gap-1">
                      <Clock size={10} />
                      {activeDeal.quietTime}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                    <span>{activeDeal.product}</span>
                    <span className="text-surface-border">•</span>
                    <span className="text-[11px] text-text-primary font-medium">{activeDeal.location}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-lg font-extrabold text-accent block">
                    {activeDeal.amount}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted uppercase">AT RISK</span>
                </div>
              </div>

              {/* Raw WhatsApp Last Message Snippet */}
              <div className="bg-surface rounded-xl p-3 border border-surface-border space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                  <span className="flex items-center gap-1 font-bold text-accent-whatsapp">
                    <MessageCircle size={12} />
                    WhatsApp Last Customer Reply
                  </span>
                  <span>Silence Triggered</span>
                </div>
                <p className="text-xs text-text-primary italic font-serif leading-relaxed">
                  "{activeDeal.chatPreview}"
                </p>
              </div>

              {/* Sabi Smart Recovery Follow-Up */}
              <div className="bg-surface rounded-xl p-3 border border-surface-border space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                  <span className="flex items-center gap-1 font-bold text-accent">
                    <Sparkles size={12} />
                    Pre-Composed Context Reminder
                  </span>
                  <span className="text-text-muted">1-Tap Send</span>
                </div>
                <p className="text-xs text-text-primary leading-relaxed font-body">
                  "{activeDeal.followupDraft}"
                </p>
              </div>

              {/* 1-Tap WhatsApp Nudge Action */}
              <div className="grid grid-cols-12 gap-2 pt-1">
                <button
                  onClick={handleCopy}
                  className="col-span-4 bg-surface border border-surface-border hover:border-accent text-text-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-accent-whatsapp" />
                      <span className="text-accent-whatsapp">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-text-muted" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <Link
                  to="/auth"
                  onClick={() => trackEvent('start_free_click', { source: 'hero_visual_followup' })}
                  className="col-span-8 bg-[#25D366] hover:bg-[#22c35e] text-[#0A0D0B] py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-[0_4px_16px_rgba(37,211,102,0.25)]"
                >
                  <MessageCircle size={14} />
                  <span>Send on WhatsApp ({activeDeal.amount})</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footnote reassurance */}
        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-text-muted">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-accent-whatsapp" />
            Runs in Mobile Browser · Zero App Download
          </span>
          <span className="text-accent font-bold">15 Free Slots</span>
        </div>
      </div>
    </div>
  )
}
export default HeroVisualAnchor
