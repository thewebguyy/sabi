import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, XCircle, Sparkles, MessageCircle, AlertCircle, Copy, ExternalLink, Check } from 'lucide-react'
import { useStore, DEFAULT_FOLLOW_UP_DELAY_HOURS } from '../store/useStore'
import { Deal } from '../types'
import { useNavigate } from 'react-router-dom'
import { trackEvent, trackMilestone } from '../lib/analytics'

export const Today: React.FC = () => {
  const { deals, markWon, markLost, recordVendorContact } = useStore()
  const navigate = useNavigate()

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [copied, setCopied] = useState(false)

  const now = new Date().getTime()
  const openDeals = deals.filter(d => d.status === 'open')

  const dealsNeedingAttention = openDeals.filter(deal => {
    const dueTime = new Date(deal.follow_up_due_at).getTime()
    const lastVendorTime = new Date(deal.last_vendor_contact_at).getTime()
    const hoursSinceVendor = (now - lastVendorTime) / (1000 * 60 * 60)
    return now >= dueTime || hoursSinceVendor >= DEFAULT_FOLLOW_UP_DELAY_HOURS
  })

  const sortedDeals = [...dealsNeedingAttention].sort((a, b) => {
    const hoursA = (now - new Date(a.last_vendor_contact_at).getTime()) / (1000 * 60 * 60)
    const hoursB = (now - new Date(b.last_vendor_contact_at).getTime()) / (1000 * 60 * 60)
    const scoreA = Number(a.amount || 0) * Math.log(hoursA + 1)
    const scoreB = Number(b.amount || 0) * Math.log(hoursB + 1)
    return scoreB - scoreA
  })

  const totalOpenValue = openDeals.reduce((sum, d) => sum + Number(d.amount || 0), 0)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val)

  const getDaysQuiet = (dateStr: string) => {
    const diffMs = now - new Date(dateStr).getTime()
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (days <= 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      return `quiet for ${hours}h`
    }
    return `quiet for ${days} ${days === 1 ? 'day' : 'days'}`
  }

  const generateDefaultMessage = (deal: Deal) =>
    `Hi ${deal.customer_name}! Just checking in on your order for ${deal.product_name} (${formatCurrency(deal.amount)}). Let me know if you are still taking it so I can reserve it for you! 😊`

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenWhatsApp = (deal: Deal, message: string) => {
    recordVendorContact(deal.id)
    trackMilestone('first_followup', { deal_id: deal.id, amount: deal.amount })
    trackEvent('whatsapp_opened', { deal_id: deal.id, customer_phone: deal.customer_phone ? 'present' : 'none' })
    const encoded = encodeURIComponent(message)
    const cleanPhone = deal.customer_phone ? deal.customer_phone.replace(/\D/g, '') : ''
    window.open(cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`, '_blank')
  }

  const handleMarkWon = (deal: Deal) => {
    trackEvent('deal_won', { deal_id: deal.id, amount: deal.amount })
    markWon(deal.id)
  }

  const handleMarkLost = (deal: Deal) => {
    trackEvent('deal_lost', { deal_id: deal.id, amount: deal.amount })
    markLost(deal.id)
  }

  return (
    <div className="space-y-6">
      {/* Header Metric Box */}
      <div className="bg-surface rounded-3xl border border-surface-border p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Total Open Value</p>
        <h2 className="text-3xl font-extrabold font-mono text-accent">
          {formatCurrency(totalOpenValue)}
        </h2>
        <p className="text-xs text-text-muted mt-1">in open opportunities</p>

        <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-text-primary">
              {sortedDeals.length} {sortedDeals.length === 1 ? 'conversation needs' : 'conversations need'} attention today
            </span>
          </div>
          <button onClick={() => navigate('/capture')} className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
            + Capture chat
          </button>
        </div>
      </div>

      {/* Actionable List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted px-1">Needs Attention Today</h3>

        {sortedDeals.length === 0 ? (
          <div className="bg-surface border border-surface-border rounded-3xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-text-primary">All caught up!</h4>
              <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
                No forgotten conversations today. Share or paste a new WhatsApp chat to start tracking.
              </p>
            </div>
            <button onClick={() => navigate('/capture')}
              className="mt-2 inline-flex items-center gap-2 bg-accent text-background font-extrabold px-4 py-2.5 rounded-xl text-xs"
            >
              <Sparkles size={16} /><span>Capture New Deal</span>
            </button>
          </div>
        ) : (
          sortedDeals.map((deal) => (
            <motion.div key={deal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-surface-border rounded-2xl p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-text-primary">{deal.customer_name}</h4>
                    <span className="text-[10px] font-semibold bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/30">
                      {getDaysQuiet(deal.last_vendor_contact_at)}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{deal.product_name}</p>
                </div>
                <span className="text-base font-bold font-mono text-accent">{formatCurrency(deal.amount)}</span>
              </div>

              {deal.customer_constraint && (
                <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-xl border border-surface-border text-xs text-text-muted">
                  <AlertCircle size={14} className="text-accent shrink-0" />
                  <span className="truncate">{deal.customer_constraint}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button onClick={() => setSelectedDeal(deal)}
                  className="flex-1 bg-accent-whatsapp text-background font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-[0_0_15px_rgba(37,211,102,0.15)]"
                >
                  <MessageCircle size={16} /><span>Follow Up</span>
                </button>
                <button onClick={() => handleMarkWon(deal)} title="Mark Won"
                  className="bg-success/15 text-success border border-success/30 p-2.5 rounded-xl hover:bg-success/25 active:scale-95 transition-all"
                ><CheckCircle2 size={16} /></button>
                <button onClick={() => handleMarkLost(deal)} title="Mark Lost"
                  className="bg-danger/15 text-danger border border-danger/30 p-2.5 rounded-xl hover:bg-danger/25 active:scale-95 transition-all"
                ><XCircle size={16} /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Follow-Up Modal */}
      <AnimatePresence>
        {selectedDeal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-surface border border-surface-border rounded-t-3xl sm:rounded-3xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                <div>
                  <h4 className="text-base font-bold text-text-primary">Follow Up with {selectedDeal.customer_name}</h4>
                  <p className="text-xs text-text-muted">{selectedDeal.product_name} • {formatCurrency(selectedDeal.amount)}</p>
                </div>
                <button onClick={() => setSelectedDeal(null)}
                  className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted">✕</button>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Suggested Message</label>
                <textarea readOnly rows={4}
                  className="w-full bg-background border border-surface-border rounded-2xl p-3.5 text-xs text-text-primary leading-relaxed resize-none outline-none font-body"
                  value={generateDefaultMessage(selectedDeal)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => handleCopyMessage(generateDefaultMessage(selectedDeal))}
                  className="bg-surface-2 text-text-primary font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
                <button onClick={() => { handleOpenWhatsApp(selectedDeal, generateDefaultMessage(selectedDeal)); setSelectedDeal(null) }}
                  className="bg-accent-whatsapp text-background font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                >
                  <ExternalLink size={16} /><span>Open WhatsApp</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Today
