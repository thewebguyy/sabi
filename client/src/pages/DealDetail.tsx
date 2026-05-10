import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ExternalLink, CheckCircle2, Clock, MessageSquare } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useStore, Deal } from '../store/useStore'
import { supabase } from '../lib/supabase'
import FollowUpSheet from '../components/FollowUpSheet'
import { getWhatsAppLink } from '../lib/utils'

const timeAgo = (dateStr: string): string => {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  return `${days} days`
}

const formatNaira = (amount: number) => {
  if (!amount) return '₦?'
  return `₦${amount.toLocaleString()}`
}

const statusLabel: Record<string, { label: string; color: string }> = {
  inquiry: { label: 'New Inquiry', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  pending: { label: 'In Progress', color: 'text-accent bg-accent/10 border-accent/20' },
  waiting_payment: { label: 'Waiting Payment', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  paid: { label: 'Paid ✓', color: 'text-success bg-success/10 border-success/20' },
  ghosted: { label: 'Ghosted', color: 'text-text-muted bg-white/5 border-white/10' },
}

const DealDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { deals, markPaid, updateDeal } = useStore()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [followUpOpen, setFollowUpOpen] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [note, setNote] = useState('')
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const fromStore = deals.find(d => d.id === id)
    if (fromStore) {
      setDeal(fromStore)
      setNote(fromStore.summary || '')
      setLoading(false)
      return
    }
    // Fallback: fetch from Supabase
    supabase.from('deals').select('*, contacts(*)').eq('id', id).single()
      .then(({ data }) => {
        if (data) {
          setDeal(data as Deal)
          setNote(data.summary || '')
        }
        setLoading(false)
      })
  }, [id, deals])

  const handleMarkPaid = async () => {
    if (!deal || deal.status === 'paid') return
    await markPaid(deal.id)
    setDeal(prev => prev ? { ...prev, status: 'paid' } : prev)
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#25D366', '#0A3828', '#FF6B35']
    })
    setTimeout(() => navigate('/deals'), 1500)
  }

  const handleNoteChange = (val: string) => {
    setNote(val)
    if (noteTimer.current) clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(async () => {
      if (!deal) return
      setSavingNote(true)
      await updateDeal(deal.id, { summary: val })
      setSavingNote(false)
    }, 800)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted mb-4">Deal not found</p>
        <Link to="/deals" className="text-accent font-bold">← Back to Deals</Link>
      </div>
    )
  }

  const statusInfo = statusLabel[deal.status] || statusLabel.inquiry
  const daysOpen = timeAgo(deal.created_at)

  return (
    <div className="pb-32">
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/deals" className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-text-muted">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-extrabold text-lg leading-none text-text-primary">{deal.contacts?.name || 'Unknown'}</h2>
          <p className="text-xs text-text-muted mt-0.5">{deal.title}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Deal Info Card */}
        <div className="bg-surface rounded-3xl border border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className="text-xs text-text-muted font-bold">{daysOpen} open</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Amount</p>
              <p className="text-2xl font-mono font-extrabold text-accent">{formatNaira(deal.amount)}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm font-bold">{statusInfo.label}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-surface rounded-3xl border border-white/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-text-muted" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-muted">Notes</span>
            </div>
            {savingNote && <span className="text-[10px] text-text-muted">Saving…</span>}
          </div>
          <textarea
            className="w-full h-28 bg-surface-2 rounded-2xl border border-white/5 p-4 text-sm text-text-primary outline-none focus:border-accent/40 transition-all resize-none font-body placeholder:text-text-muted/30"
            placeholder="Add notes about this deal…"
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setFollowUpOpen(true)}
            className="w-full bg-surface-2 border border-white/5 py-4 rounded-2xl text-sm font-bold text-text-primary flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:border-accent/20"
          >
            <Clock size={18} className="text-accent" />
            Follow Up
          </button>

          <button
            onClick={handleMarkPaid}
            disabled={deal.status === 'paid'}
            className="w-full bg-surface-2 border border-white/5 py-4 rounded-2xl text-sm font-bold text-text-primary flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:border-accent/20 disabled:opacity-40"
          >
            <CheckCircle2 size={18} className="text-accent" />
            {deal.status === 'paid' ? 'Already Paid ✓' : 'Mark as Paid'}
          </button>

          <a
            href={getWhatsAppLink(deal.contacts?.phone || '', deal.ai_suggested_reply || `Hi! Just following up on ${deal.title}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-accent text-primary font-extrabold py-4 rounded-2xl text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(37,211,102,0.3)]"
          >
            Open in WhatsApp
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {followUpOpen && (
          <FollowUpSheet deal={deal} onClose={() => setFollowUpOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default DealDetail
