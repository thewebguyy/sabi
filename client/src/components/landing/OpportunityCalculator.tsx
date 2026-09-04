import React, { useState, useCallback } from 'react'

const OpportunityCalculator: React.FC = () => {
  const [dailyChats, setDailyChats] = useState(12)
  const [avgOrderValue, setAvgOrderValue] = useState(18000)
  const [coldPercent, setColdPercent] = useState(25)

  const monthlyOpportunity = useCallback(() => {
    const dailyCold = dailyChats * (coldPercent / 100)
    const monthly = dailyCold * avgOrderValue * 30
    return Math.round(monthly)
  }, [dailyChats, avgOrderValue, coldPercent])

  const formatNaira = (val: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <section className="py-20 px-6 border-t border-[#1C221E]" id="calculator">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial framing */}
          <div className="lg:col-span-5 space-y-5">
            <p className="editorial-kicker text-accent">Financial Instrumentation</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold leading-[1.08] text-text-primary">
              How much money is sitting in forgotten chats?
            </h2>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              Customers rarely say "I'm not buying anymore." They just get distracted, and you get busy. When a deal is left alone for 3 days, the customer buys elsewhere.
            </p>
            <div className="p-4 rounded-xl bg-[#121513] border border-[#232B25] space-y-1">
              <p className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                Control your own numbers
              </p>
              <p className="text-xs text-text-muted">
                Adjust the sliders to match your typical order sizes and conversation volume.
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
                  max={50}
                  value={dailyChats}
                  onChange={(e) => setDailyChats(Number(e.target.value))}
                  className="sabi-slider"
                />
                <div className="flex justify-between font-mono text-[10px] text-text-muted">
                  <span>3 inquiries</span>
                  <span>50 inquiries</span>
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
                  max={200000}
                  step={1000}
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="sabi-slider"
                />
                <div className="flex justify-between font-mono text-[10px] text-text-muted">
                  <span>₦5,000</span>
                  <span>₦200,000</span>
                </div>
              </div>

              {/* Slider 3: % that go quiet */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs sm:text-sm font-bold text-text-primary">
                    % of inquiries that go quiet after quoting price
                  </label>
                  <span className="font-mono text-sm sm:text-base font-bold text-accent">
                    {coldPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={coldPercent}
                  onChange={(e) => setColdPercent(Number(e.target.value))}
                  className="sabi-slider"
                />
                <div className="flex justify-between font-mono text-[10px] text-text-muted">
                  <span>10% quiet</span>
                  <span>50% quiet</span>
                </div>
              </div>

              {/* Output Readout */}
              <div className="bg-[#0A0D0B] border border-accent/30 rounded-xl p-5 sm:p-6 text-center space-y-2">
                <p className="editorial-kicker text-text-muted">
                  POTENTIAL REVENUE IN QUIET CONVERSATIONS
                </p>
                <p className="font-mono text-3xl sm:text-5xl font-extrabold text-accent">
                  {formatNaira(monthlyOpportunity())}
                  <span className="text-sm font-normal text-text-muted font-sans ml-1">/ month</span>
                </p>
                <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto">
                  At your numbers, that is approximately {Math.round(dailyChats * (coldPercent / 100) * 30)} customers every month waiting for a follow-up.
                </p>
              </div>

              <p className="text-center font-mono text-[10px] text-text-muted">
                ILLUSTRATIVE CALCULATION · BASED ON YOUR ESTIMATES
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OpportunityCalculator
