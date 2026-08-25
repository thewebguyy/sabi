import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, XCircle, Sparkles, MessageCircle, AlertCircle, Copy, ExternalLink, Check } from 'lucide-react'
import { useStore, DEFAULT_FOLLOW_UP_DELAY_HOURS } from '../store/useStore'
import { Deal } from '../types'
import { useNavigate } from 'react-router-dom'

export const Today: React.FC = () => {
  const { deals, markWon, markLost, recordVendorContact } = useStore()
  const navigate = useNavigate()

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [copied, setCopied] = useState(false)

  // Filter open deals requiring attention
  const now = new Date().getTime()
  
  const openDeals = deals.filter(d => d.status === 'open')

  const dealsNeedingAttention = openDeals.filter(deal => {
    const dueTime = new Date(deal.follow_up_due_at).getTime()
    const lastVendorTime = new Date(deal.last_vendor_contact_at).getTime()
    const hoursSinceVendor = (now - lastVendorTime) / (1000 * 60 * 60)
    return now >= dueTime || hoursSinceVendor >= DEFAULT_FOLLOW_UP_DELAY_HOURS
  })

  // Priority score sorting: amount * ln(hours_inactive + 1)
  const sortedDeals = [...dealsNeedingAttention].sort((a, b) => {
    const hoursA = (now - new Date(a.last_vendor_contact_at).getTime()) / (1000 * 60 * 60)
    const hoursB = (now - new Date(b.last_vendor_contact_at).getTime()) / (1000 * 60 * 60)
    const scoreA = Number(a.amount || 0) * Math.log(hoursA + 1)
    const scoreB = Number(b.amount || 0) * Math.log(hoursB + 1)
    return scoreB - scoreA
  })

  const totalOpenValue = openDeals.reduce((sum, d) => sum + Number(d.amount || 0), 0)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val)
  }

  const getDaysQuiet = (dateStr: string) => {
    const diffMs = now - new Date(dateStr).getTime()
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (days <= 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      return `quiet for ${hours}h`
    }
    return `quiet for ${days} ${days === 1 ? 'day' : 'days'}`
  }

  const generateDefaultMessage = (deal: Deal) => {
    return `Hi ${deal.customer_name}! Just checking in on your order for ${deal.product_name} (${formatCurrency(deal.amount)}). Let me know if you are still taking it so I can reserve it for you! 😊`
  }

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenWhatsApp = (deal: Deal, message: string) => {
    recordVendorContact(deal.id)
    const encoded = encodeURIComponent(message)
    if (deal.customer_phone) {
      const cleanPhone = deal.customer_phone.replace(/\D/g, '')
      window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank')
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Metric Box */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB020]/10 rounded-full blur-2xl pointer-events-none" />
        
        <p className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-1">Total Open Value</p>
        <h2 className="text-3xl font-extrabold font-mono text-[#FFB020]">
          {formatCurrency(totalOpenValue)}
        </h2>
        <p className="text-xs text-[#8E8E93] mt-1">
          in open opportunities
        </p>

        <div className="mt-4 pt-4 border-t border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FFB020] animate-pulse" />
            <span className="text-xs font-semibold text-[#F3F2EF]">
              {sortedDeals.length} {sortedDeals.length === 1 ? 'conversation needs' : 'conversations need'} attention today
            </span>
          </div>
          <button 
            onClick={() => navigate('/capture')} 
            className="text-xs font-bold text-[#FFB020] hover:underline flex items-center gap-1"
          >
            + Capture chat
          </button>
        </div>
      </div>

      {/* Actionable List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] px-1">
          Needs Attention Today
        </h3>

        {sortedDeals.length === 0 ? (
          <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#F3F2EF]">All caught up!</h4>
              <p className="text-xs text-[#8E8E93] mt-1 max-w-xs mx-auto">
                No forgotten conversations today. Share or paste a new WhatsApp chat to start tracking.
              </p>
            </div>
            <button
              onClick={() => navigate('/capture')}
              className="mt-2 inline-flex items-center gap-2 bg-[#FFB020] text-[#0A0A0A] font-extrabold px-4 py-2.5 rounded-xl text-xs"
            >
              <Sparkles size={16} />
              <span>Capture New Deal</span>
            </button>
          </div>
        ) : (
          sortedDeals.map((deal) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141414] border border-[#262626] rounded-2xl p-4 space-y-3 relative group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-[#F3F2EF]">{deal.customer_name}</h4>
                    <span className="text-[10px] font-semibold bg-[#FFB020]/15 text-[#FFB020] px-2 py-0.5 rounded-full border border-[#FFB020]/30">
                      {getDaysQuiet(deal.last_vendor_contact_at)}
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E93] mt-0.5">{deal.product_name}</p>
                </div>
                <span className="text-base font-bold font-mono text-[#FFB020]">
                  {formatCurrency(deal.amount)}
                </span>
              </div>

              {deal.customer_constraint && (
                <div className="flex items-center gap-1.5 bg-[#0A0A0A] px-3 py-1.5 rounded-xl border border-[#262626] text-xs text-[#8E8E93]">
                  <AlertCircle size={14} className="text-[#FFB020] shrink-0" />
                  <span className="truncate">{deal.customer_constraint}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setSelectedDeal(deal)}
                  className="flex-1 bg-[#25D366] text-[#0A0A0A] font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-[0_0_15px_rgba(37,211,102,0.15)]"
                >
                  <MessageCircle size={16} />
                  <span>Follow Up</span>
                </button>
                <button
                  onClick={() => markWon(deal.id)}
                  title="Mark Won"
                  className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 p-2.5 rounded-xl hover:bg-[#10B981]/25 active:scale-95 transition-all"
                >
                  <CheckCircle2 size={16} />
                </button>
                <button
                  onClick={() => markLost(deal.id)}
                  title="Mark Lost"
                  className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 p-2.5 rounded-xl hover:bg-[#EF4444]/25 active:scale-95 transition-all"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Follow-Up Modal */}
      <AnimatePresence>
        {selectedDeal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A0A0A]/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-t-3xl sm:rounded-3xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#262626]">
                <div>
                  <h4 className="text-base font-bold text-[#F3F2EF]">Follow Up with {selectedDeal.customer_name}</h4>
                  <p className="text-xs text-[#8E8E93]">{selectedDeal.product_name} • {formatCurrency(selectedDeal.amount)}</p>
                </div>
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-[#8E8E93]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                  Suggested Message
                </label>
                <textarea
                  readOnly
                  rows={4}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-3.5 text-xs text-[#F3F2EF] leading-relaxed resize-none outline-none"
                  value={generateDefaultMessage(selectedDeal)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleCopyMessage(generateDefaultMessage(selectedDeal))}
                  className="bg-[#262626] text-[#F3F2EF] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  {copied ? <Check size={16} className="text-[#10B981]" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenWhatsApp(selectedDeal, generateDefaultMessage(selectedDeal))
                    setSelectedDeal(null)
                  }}
                  className="bg-[#25D366] text-[#0A0A0A] font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                >
                  <ExternalLink size={16} />
                  <span>Open WhatsApp</span>
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
