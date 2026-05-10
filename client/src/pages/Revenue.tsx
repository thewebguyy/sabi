import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowUpRight, Clock, HeartHandshake } from 'lucide-react'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import axios from 'axios'
import confetti from 'canvas-confetti'

const formatNaira = (n: number) => {
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n?.toLocaleString() || 0}`
}

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${minutes}m ago`
}

interface PaidDeal {
  id: string
  title: string
  amount: number
  updated_at: string
  via_paystack?: boolean
  contacts?: { name: string }
}

interface RevenueData {
  today: number
  thisWeek: number
  lastWeek: number
  weekPct: number | null
  thisMonth: number
  recovered_revenue: number
  recovered_deals: number
  recent: PaidDeal[]
}

const Revenue: React.FC = () => {
  const { user } = useStore()
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchRevenue = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        const { data: { session } } = await supabase.auth.getSession()
        const res = await axios.get(`${apiUrl}/api/revenue`, {
          headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
        })
        
        setData(res.data)

        if (res.data.recovered_revenue > 0 && localStorage.getItem('sabi_recovered_confetti') !== 'true') {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#25D366', '#0A3828', '#FF6B35']
          })
          localStorage.setItem('sabi_recovered_confetti', 'true')
        }
      } catch (err) {
        console.error('Failed to fetch revenue', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRevenue()
  }, [user])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isWeekUp = data.weekPct === null ? null : data.weekPct >= 0

  return (
    <div className="pb-24 space-y-6">
      
      {/* Recovered Revenue Card */}
      {data.recovered_revenue > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-accent text-primary rounded-3xl p-6 shadow-[0_10px_40px_rgba(37,211,102,0.2)]"
        >
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <HeartHandshake size={16} />
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Recovered by Sabi</h3>
          </div>
          <p className="text-2xl font-extrabold tracking-tight mb-1">
            {formatNaira(data.recovered_revenue)} <span className="text-sm font-bold opacity-80">across {data.recovered_deals} deals</span>
          </p>
          <p className="text-xs font-medium opacity-80">Money you would have lost without follow-ups.</p>
        </motion.div>
      )}

      {/* This Week */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-3xl border border-white/5 p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
        <div className="relative">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">This Week</p>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-4xl font-mono font-extrabold text-text-primary">{formatNaira(data.thisWeek)}</span>
            {data.weekPct !== null && (
              <div className={`flex items-center gap-1 text-sm font-bold mb-1 ${isWeekUp ? 'text-accent' : 'text-hot'}`}>
                {isWeekUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(data.weekPct)}% vs last week
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 rounded-2xl px-4 py-3 flex-1">
              <p className="text-[10px] text-text-muted font-bold uppercase mb-1">Deals Closed</p>
              <p className="text-xl font-mono font-bold">{data.recent.filter(d => new Date(d.updated_at).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000).length}</p>
            </div>
            <div className="bg-white/5 rounded-2xl px-4 py-3 flex-1">
              <p className="text-[10px] text-text-muted font-bold uppercase mb-1">This Month</p>
              <p className="text-xl font-mono font-bold text-accent">{formatNaira(data.thisMonth)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Paid Deals */}
      <div>
        <h2 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-muted mb-4">Recent Payments</h2>
        {data.recent.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">No paid deals yet.</p>
            <p className="text-text-muted/50 text-xs mt-2">Mark a deal as Paid to see it here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.recent.map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-surface rounded-2xl border border-white/5 p-4 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {(deal.contacts?.name || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm truncate text-text-primary">{deal.contacts?.name || 'Unknown'}</p>
                    {deal.via_paystack && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-accent/20 text-accent border border-accent/20">
                        Via Sabi Pay
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate mt-0.5">{deal.title}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono font-bold text-sm text-accent">{formatNaira(deal.amount)}</p>
                  <p className="text-[10px] text-text-muted flex items-center justify-end gap-1 mt-0.5">
                    <Clock size={10} />
                    {timeAgo(deal.updated_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Revenue
