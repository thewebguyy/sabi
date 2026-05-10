import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, TrendingUp, TrendingDown, Clock, CheckCircle2, Flame, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useStore, Deal } from '../store/useStore'
import AddDealSheet from '../components/AddDealSheet'
import FollowUpSheet from '../components/FollowUpSheet'

const timeAgo = (dateStr: string): string => {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (days > 1) return `${days} days ago`
  if (days === 1) return 'Yesterday'
  if (hours > 1) return `${hours} hours ago`
  if (hours === 1) return '1 hour ago'
  if (minutes > 1) return `${minutes} min ago`
  return 'Just now'
}

const formatNaira = (amount: number) => {
  if (!amount || amount === 0) return '₦?'
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`
  return `₦${amount.toLocaleString()}`
}

const statusColors: Record<string, string> = {
  inquiry: 'bg-yellow-400/10 text-yellow-400',
  pending: 'bg-accent/10 text-accent',
  waiting_payment: 'bg-blue-400/10 text-blue-400',
  ghosted: 'bg-white/5 text-text-muted',
}

const DealCard = ({ deal, onFollowUp, onPaid }: { deal: Deal; onFollowUp: (deal: Deal) => void; onPaid: (deal: Deal) => void }) => {
  const [paying, setPaying] = useState(false)

  const handlePaid = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPaying(true)
    await onPaid(deal)
    setPaying(false)
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#25D366', '#0A3828', '#facc15']
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-surface rounded-3xl border border-white/5 overflow-hidden"
    >
      <Link to={`/deals/${deal.id}`} className="block p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
            {(deal.contacts?.name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-0.5">
              <p className="font-bold text-text-primary truncate pr-2">{deal.contacts?.name || 'Unknown'}</p>
              <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">
                {timeAgo(deal.last_contact_time || deal.updated_at || deal.created_at)}
              </span>
            </div>
            <p className="text-sm text-text-muted truncate mb-2">{deal.title}</p>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusColors[deal.status] || 'bg-white/5 text-text-muted'}`}>
                {deal.status === 'waiting_payment' ? 'Waiting Payment' : deal.status}
              </span>
              <span className="text-sm font-mono font-bold text-text-primary">
                {formatNaira(deal.amount)}
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="text-text-muted flex-shrink-0 mt-1" />
        </div>
      </Link>

      {/* Action row */}
      <div className="flex border-t border-white/5">
        <button
          onClick={(e) => { e.preventDefault(); onFollowUp(deal) }}
          className="flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold text-text-muted hover:text-accent hover:bg-accent/5 transition-all"
        >
          <Clock size={14} />
          Follow Up
        </button>
        <div className="w-px bg-white/5" />
        <button
          onClick={handlePaid}
          disabled={paying}
          className="flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold text-text-muted hover:text-accent hover:bg-accent/5 transition-all disabled:opacity-50"
        >
          {paying
            ? <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            : <CheckCircle2 size={14} />
          }
          Paid ✓
        </button>
      </div>
    </motion.div>
  )
}

const Deals: React.FC = () => {
  const { deals, loading, markPaid, user } = useStore()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [followUpDeal, setFollowUpDeal] = useState<Deal | null>(null)

  const followUpHours = user?.follow_up_hours ?? 48

  // Revenue: today vs yesterday from all deals (including paid ones fetched separately)
  // For now approximate from current store + seeded data
  const todayRevenue = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return deals.filter(d => d.status === 'paid' && new Date(d.updated_at) >= today)
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
  }, [deals])

  // "Needs Attention" — open deals where last_contact_time > followUpHours ago
  const needsAttention = useMemo(() => {
    const cutoff = Date.now() - followUpHours * 60 * 60 * 1000
    return deals
      .filter(d => d.status !== 'paid' && new Date(d.last_contact_time || d.updated_at || d.created_at).getTime() < cutoff)
      .sort((a, b) => new Date(a.last_contact_time || a.created_at).getTime() - new Date(b.last_contact_time || b.created_at).getTime())
      .slice(0, 5)
  }, [deals, followUpHours])

  const handlePaidWrapper = (deal: Deal) => markPaid(deal.id)

  const openDeals = useMemo(() => {
    return deals.filter(d => d.status !== 'paid')
      .sort((a, b) => new Date(b.last_contact_time || b.updated_at || b.created_at).getTime() - new Date(a.last_contact_time || a.updated_at || a.created_at).getTime())
  }, [deals])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pb-32">
      {/* Revenue Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-3xl border border-white/5 p-5 mb-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Today's Revenue</p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-mono font-extrabold text-text-primary">{formatNaira(todayRevenue)}</span>
            {todayRevenue > 0
              ? <span className="flex items-center gap-1 text-accent text-xs font-bold mb-1"><TrendingUp size={14} /> Great!</span>
              : <span className="flex items-center gap-1 text-text-muted text-xs font-bold mb-1"><TrendingDown size={14} /> No sales yet</span>
            }
          </div>
        </div>
      </motion.div>

      {/* Needs Attention Section */}
      {needsAttention.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={16} className="text-hot" />
            <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-hot">Needs Attention</h2>
            <span className="bg-hot text-primary text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">{needsAttention.length}</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {needsAttention.map(deal => (
                <DealCard key={deal.id} deal={deal} onFollowUp={setFollowUpDeal} onPaid={handlePaidWrapper} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* All Open Deals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-text-muted">All Open Deals</h2>
          {openDeals.length > 0 && (
            <span className="text-xs text-text-muted font-bold">{openDeals.length} deals</span>
          )}
        </div>

        {openDeals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">All caught up! 🎉</h3>
            <p className="text-text-muted text-sm px-10 mb-6">Tap + to add your first deal</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {openDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} onFollowUp={setFollowUpDeal} onPaid={handlePaidWrapper} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-accent text-primary rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.5)] flex items-center justify-center z-50 border-4 border-background"
      >
        <Plus size={28} />
      </motion.button>

      <AddDealSheet isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      {followUpDeal && (
        <FollowUpSheet deal={followUpDeal} onClose={() => setFollowUpDeal(null)} />
      )}
    </div>
  )
}

export default Deals
