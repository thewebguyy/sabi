import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, ArrowRight, ShieldCheck, Flame, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../../lib/analytics'

const OpportunityCalculator: React.FC = () => {
  const [dailyChats, setDailyChats] = useState(12)
  const [avgOrderValue, setAvgOrderValue] = useState(25000)
  const [coldPercent, setColdPercent] = useState(25)

  // Typical 26 trade days per month for Nigerian market commerce
  const SELLING_DAYS = 26

  const monthlyOpportunity = useCallback(() => {
    const dailyCold = dailyChats * (coldPercent / 100)
    const monthly = dailyCold * avgOrderValue * SELLING_DAYS
    return Math.round(monthly)
  }, [dailyChats, avgOrderValue, coldPercent])

  const yearlyOpportunity = useCallback(() => {
    return monthlyOpportunity() * 12
  }, [monthlyOpportunity])

  const potentialDealsPerMonth = Math.round(dailyChats * (coldPercent / 100) * SELLING_DAYS)

  const formatNaira = (val: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const handleSliderChange = (type: string, val: number) => {
    trackEvent('calculator_interaction', { type, value: val })
  }

  const lostAmount = monthlyOpportunity()

  return (
    <section className="py-24 px-6 border-t border-surface-border relative overflow-hidden" id="calculator">
      {/* Background soft ambient radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-danger/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 border border-danger/30 text-danger text-[11px] font-mono font-bold">
            <TrendingDown size={13} />
            <span>THE REVENUE LEAK CALCULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold leading-[1.06] text-text-primary">
            How much money are you leaving in dead chats?
          </h2>
          <p className="text-base sm:text-lg text-text-muted">
            Drag the sliders to see what unclosed WhatsApp inquiries are quietly costing your business every month.
          </p>
        </div>

        {/* Dynamic Calculator Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Sliders */}
          <div className="lg:col-span-7 bg-surface rounded-3xl border border-surface-border p-6 sm:p-8 shadow-xl space-y-7 flex flex-col justify-between">
            {/* Slider 1: Daily Inquiries */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <label className="text-sm font-extrabold text-text-primary block">
                    Daily inquiries on WhatsApp
                  </label>
                  <span className="text-[11px] text-text-muted">People asking "How much?", "Is it available?"</span>
                </div>
                <span className="font-mono text-base font-extrabold text-accent bg-accent/10 border border-accent/30 px-3 py-1 rounded-xl">
                  {dailyChats} chats / day
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={50}
                value={dailyChats}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setDailyChats(v)
                  handleSliderChange('daily_chats', v)
                }}
                className="sabi-slider"
              />
              <div className="flex justify-between font-mono text-[10px] text-text-muted">
                <span>3 inquiries</span>
                <span>25 inquiries</span>
                <span>50 inquiries</span>
              </div>
            </div>

            {/* Slider 2: Average Order Value */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <label className="text-sm font-extrabold text-text-primary block">
                    Average order value
                  </label>
                  <span className="text-[11px] text-text-muted">Typical price of your items or bundles</span>
                </div>
                <span className="font-mono text-base font-extrabold text-accent bg-accent/10 border border-accent/30 px-3 py-1 rounded-xl">
                  {formatNaira(avgOrderValue)}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={200000}
                step={2500}
                value={avgOrderValue}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setAvgOrderValue(v)
                  handleSliderChange('avg_order_value', v)
                }}
                className="sabi-slider"
              />
              <div className="flex justify-between font-mono text-[10px] text-text-muted">
                <span>₦5,000</span>
                <span>₦100,000</span>
                <span>₦200,000</span>
              </div>
            </div>

            {/* Slider 3: Cold Chat % */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <label className="text-sm font-extrabold text-text-primary block">
                    Percentage that go quiet
                  </label>
                  <span className="text-[11px] text-text-muted">Buyers who ask price, then don't reply</span>
                </div>
                <span className="font-mono text-base font-extrabold text-danger bg-danger/10 border border-danger/30 px-3 py-1 rounded-xl">
                  {coldPercent}% quiet
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={coldPercent}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setColdPercent(v)
                  handleSliderChange('cold_percent', v)
                }}
                className="sabi-slider"
              />
              <div className="flex justify-between font-mono text-[10px] text-text-muted">
                <span>10% (Low)</span>
                <span>30% (Average)</span>
                <span>60% (High)</span>
              </div>
            </div>

            {/* Formula Transparency Note */}
            <div className="p-3.5 rounded-xl bg-surface-2 border border-surface-border text-xs text-text-muted flex items-center justify-between">
              <span>Formula: <strong className="text-text-primary font-mono">Inquiries × Price × Quiet % × 26 days</strong></span>
              <span className="font-mono text-[10px] text-accent font-bold">Lagos 6-Day Trade Week</span>
            </div>
          </div>

          {/* Right Column: Visceral Lost Revenue Ticker & Recovery CTA */}
          <div className="lg:col-span-5 bg-surface-2 rounded-3xl border border-danger/30 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-danger flex items-center gap-1.5">
                  <Flame size={14} className="text-danger animate-pulse" />
                  ESTIMATED LOST REVENUE
                </span>
                <span className="font-mono text-[10px] bg-danger/10 text-danger border border-danger/30 px-2 py-0.5 rounded font-bold">
                  {potentialDealsPerMonth} DEALS LOST / MO
                </span>
              </div>

              {/* Giant Red Ticking Figure */}
              <motion.div
                key={lostAmount}
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                className="py-2"
              >
                <div className="font-mono text-4xl sm:text-5xl lg:text-[54px] font-black text-danger tracking-tight leading-none">
                  {formatNaira(lostAmount)}
                </div>
                <p className="text-xs text-text-muted font-mono mt-2">
                  per month slipping through forgotten WhatsApp chats
                </p>
              </motion.div>

              {/* Yearly Impact Warning */}
              <div className="p-4 rounded-2xl bg-surface border border-surface-border space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted font-medium">Annualized Loss:</span>
                  <span className="font-mono font-extrabold text-text-primary text-sm">
                    {formatNaira(yearlyOpportunity())} / year
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Even if Sabi helps you revive just <strong className="text-accent">20%</strong> of these quiet conversations, that is <strong className="text-accent-whatsapp font-mono">{formatNaira(Math.round(lostAmount * 0.2))}</strong> recovered every single month.
                </p>
              </div>
            </div>

            {/* Direct High-Motivation Conversion Card */}
            <div className="space-y-3 pt-2">
              <Link
                to="/auth"
                onClick={() => trackEvent('start_free_click', { source: 'calculator_recovery_cta', lost_amount: lostAmount })}
                className="w-full bg-accent text-white dark:text-background font-extrabold py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(217,119,6,0.3)]"
              >
                <span>Recover This Money — Start Free</span>
                <ArrowRight size={18} />
              </Link>
              <p className="text-center font-mono text-[11px] text-text-muted flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-accent-whatsapp" />
                <span>₦0 to start · Free plan includes 15 deal slots</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default OpportunityCalculator
