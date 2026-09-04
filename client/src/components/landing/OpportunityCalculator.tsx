import React, { useState, useCallback } from 'react'
import { trackEvent } from '../../lib/analytics'

const OpportunityCalculator: React.FC = () => {
  const [dailyChats, setDailyChats] = useState(10)
  const [avgOrderValue, setAvgOrderValue] = useState(15000)
  const [coldPercent, setColdPercent] = useState(20)

  // 26 commercial selling days per month (standard Monday-Saturday retail cycle)
  const SELLING_DAYS = 26

  const monthlyOpportunity = useCallback(() => {
    const dailyCold = dailyChats * (coldPercent / 100)
    const monthly = dailyCold * avgOrderValue * SELLING_DAYS
    return Math.round(monthly)
  }, [dailyChats, avgOrderValue, coldPercent])

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

  const potentialDealsPerMonth = Math.round(dailyChats * (coldPercent / 100) * SELLING_DAYS)

  return (
    <section className="py-20 px-6 border-t border-[#1C221E]" id="calculator">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial framing */}
          <div className="lg:col-span-5 space-y-5">
            <p className="editorial-kicker text-accent">Conversation Economics</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold leading-[1.08] text-text-primary">
              How much conversation value goes quiet?
            </h2>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              Customers rarely say "I'm not buying anymore." They simply get distracted, and you get busy. When a chat is left alone for 48 hours, that conversation quietly dies.
            </p>
            <div className="p-4 rounded-xl bg-[#121513] border border-[#232B25] space-y-2">
              <p className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                Transparent math · You control assumptions
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                We calculate: <span className="font-mono text-text-primary">Inquiries/day × Avg Order × Quiet % × 26 selling days</span>. No hidden multipliers or inflated claims.
              </p>
            </div>
          </div>

          {/* Right Column: Calculator Widget */}
          <div className="lg:col-span-7">
            <div className="bg-[#121513] rounded-2xl border border-[#232B25] p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Slider 1: Daily chats */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs sm:text-sm font-bold text-text-primary">
                    Daily sales inquiries on WhatsApp
                  </label>
                  <span className="font-mono text-sm sm:text-base font-bold text-accent">
                    {dailyChats} chats / day
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={40}
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
                  <span>40 inquiries</span>
                </div>
              </div>

              {/* Slider 2: Average Order Value */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs sm:text-sm font-bold text-text-primary">
                    Average order value
                  </label>
                  <span className="font-mono text-sm sm:text-base font-bold text-accent">
                    {formatNaira(avgOrderValue)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={100000}
                  step={1000}
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
                </div>
              </div>

              {/* Slider 3: % that go quiet */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs sm:text-sm font-bold text-text-primary">
                    % of conversations that go quiet after pricing
                  </label>
                  <span className="font-mono text-sm sm:text-base font-bold text-accent">
                    {coldPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  value={coldPercent}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setColdPercent(v)
                    handleSliderChange('cold_percent', v)
                  }}
                  className="sabi-slider"
                />
                <div className="flex justify-between font-mono text-[10px] text-text-muted">
                  <span>10% quiet</span>
                  <span>40% quiet</span>
                </div>
              </div>

              {/* Output Readout */}
              <div className="bg-[#0A0D0B] border border-accent/30 rounded-xl p-5 sm:p-6 text-center space-y-2.5">
                <p className="editorial-kicker text-text-muted">
                  POTENTIAL OPPORTUNITY WORTH FOLLOWING UP
                </p>
                <p className="font-mono text-3xl sm:text-5xl font-extrabold text-accent">
                  {formatNaira(monthlyOpportunity())}
                  <span className="text-sm font-normal text-text-muted font-sans ml-1">/ month</span>
                </p>

                {/* Explicit breakdown formula */}
                <div className="pt-2 border-t border-[#1F2521] text-xs font-mono text-text-muted space-y-1">
                  <p>
                    {dailyChats} chats × {formatNaira(avgOrderValue)} × {coldPercent}% × {SELLING_DAYS} days
                  </p>
                  <p className="text-[#8E9490]">
                    ≈ {potentialDealsPerMonth} customer conversations worth checking back on each month
                  </p>
                </div>
              </div>

              <p className="text-center font-mono text-[10px] text-text-muted">
                ILLUSTRATIVE OPPORTUNITY BASED ON YOUR ASSUMPTIONS · NOT GUARANTEED REVENUE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OpportunityCalculator
