import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowUpRight, Clock } from 'lucide-react'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'

const formatNaira = (n: number) => {
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `₦${(n / 1000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
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
  contacts?: { name: string }
}

const Revenue: React.FC = () => {
  const { user } = useStore()
  const [recentPaid, setRecentPaid] = useState<PaidDeal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchRevenue = async () => {
      const { data } = await supabase
        .from('deals')
        .select('id, title, amount, updated_at, contacts(name)')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .order('updated_at', { ascending: false })
        .limit(50)
      setRecentPaid((data as unknown as PaidDeal[]) || [])
      setLoading(false)
    }
    fetchRevenue()
  }, [user])

  const now = new Date()

  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfLastWeek = new Date(startOfWeek)
  startOfLastWeek.setDate(startOfWeek.getDate() - 7)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const thisWeek = recentPaid.filter(d => new Date(d.updated_at) >= startOfWeek)
  const lastWeek = recentPaid.filter(d => new Date(d.updated_at) >= startOfLastWeek && new Date(d.updated_at) < startOfWeek)
  const thisMonth = recentPaid.filter(d => new Date(d.updated_at) >= startOfMonth)

  const weekTotal = thisWeek.reduce((s, d) => s + (d.amount || 0), 0)
  const lastWeekTotal = lastWeek.reduce((s, d) => s + (d.amount || 0), 0)
  const monthTotal = thisMonth.reduce((s, d) => s + (d.amount || 0), 0)

  const weekPct = lastWeekTotal === 0 ? null : Math.round(((weekTotal - lastWeekTotal) / lastWeekTotal) * 100)
  const isWeekUp = weekPct === null ? null : weekPct >= 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pb-24 space-y-6">
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
            <span className="text-4xl font-mono font-extrabold text-text-primary">{formatNaira(weekTotal)}</span>
            {weekPct !== null && (
              <div className={`flex items-center gap-1 text-sm font-bold mb-1 ${isWeekUp ? 'text-accent' : 'text-hot'}`}>
                {isWeekUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(weekPct)}% vs last week
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 rounded-2xl px-4 py-3 flex-1">
              <p className="text-[10px] text-text-muted font-bold uppercase mb-1">Deals Closed</p>
              <p className="text-xl font-mono font-bold">{thisWeek.length}</p>
            </div>
            <div className="bg-white/5 rounded-2xl px-4 py-3 flex-1">
              <p className="text-[10px] text-text-muted font-bold uppercase mb-1">This Month</p>
              <p className="text-xl font-mono font-bold text-accent">{formatNaira(monthTotal)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Paid Deals */}
      <div>
        <h2 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-muted mb-4">Recent Payments</h2>
        {recentPaid.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">No paid deals yet.</p>
            <p className="text-text-muted/50 text-xs mt-2">Mark a deal as Paid to see it here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentPaid.slice(0, 20).map((deal, i) => (
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
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate text-text-primary">{deal.contacts?.name || 'Unknown'}</p>
                  <p className="text-xs text-text-muted truncate">{deal.title}</p>
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
