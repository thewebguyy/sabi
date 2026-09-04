import React, { useState, useCallback } from 'react'
import { Calculator } from 'lucide-react'

const OpportunityCalculator: React.FC = () => {
  const [dailyChats, setDailyChats] = useState(10)
  const [avgOrderValue, setAvgOrderValue] = useState(15000)
  const [coldPercent, setColdPercent] = useState(20)

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
    <section className="py-16 px-6" id="calculator">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={16} className="text-accent" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Opportunity Calculator
          </p>
        </div>
        <h2 className="text-2xl font-display font-extrabold mb-2 leading-tight">
          How much could be sitting in forgotten chats?
        </h2>
        <p className="text-sm text-text-muted mb-8">
          Adjust the sliders to match your business. You control the assumptions.
        </p>

        <div className="bg-surface rounded-3xl border border-surface-border p-6 space-y-6">
          {/* Slider 1: Daily chats */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-text-primary">
                Daily sales conversations
              </label>
              <span className="text-sm font-mono font-bold text-accent">{dailyChats}</span>
            </div>
            <input
              type="range"
              min={3}
              max={50}
              value={dailyChats}
              onChange={(e) => setDailyChats(Number(e.target.value))}
              className="sabi-slider"
            />
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>3/day</span>
              <span>50/day</span>
            </div>
          </div>

          {/* Slider 2: Average order value */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-text-primary">
                Average order value
              </label>
              <span className="text-sm font-mono font-bold text-accent">
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
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>₦5,000</span>
              <span>₦200,000</span>
            </div>
          </div>

          {/* Slider 3: Cold percent */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-text-primary">
                % of conversations that go cold
              </label>
              <span className="text-sm font-mono font-bold text-accent">{coldPercent}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              value={coldPercent}
              onChange={(e) => setColdPercent(Number(e.target.value))}
              className="sabi-slider"
            />
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Result */}
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 text-center space-y-2">
            <p className="text-xs text-text-muted font-medium">
              At your assumptions, approximately
            </p>
            <p className="text-3xl font-mono font-extrabold text-accent">
              {formatNaira(monthlyOpportunity())}
              <span className="text-sm text-text-muted font-body font-bold">/month</span>
            </p>
            <p className="text-xs text-text-muted">
              could be sitting in conversations worth following up.
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-3 italic">
          This is an illustrative estimate based on the assumptions you set above.
        </p>
      </div>
    </section>
  )
}

export default OpportunityCalculator
