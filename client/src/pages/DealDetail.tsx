import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ExternalLink, CheckCircle2, XCircle, Clock, MessageSquare, AlertCircle } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Deal } from '../types'

const formatNaira = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount || 0)
}

const DealDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { deals, markWon, markLost, recordVendorContact } = useStore()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = deals.find(d => d.id === id)
    if (found) {
      setDeal(found)
    }
    setLoading(false)
  }, [id, deals])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-3 border-[#FFB020] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-[#8E8E93] text-sm">Opportunity not found</p>
        <Link to="/deals" className="text-[#FFB020] font-bold text-xs hover:underline">← Back to All Deals</Link>
      </div>
    )
  }

  const handleFollowUp = () => {
    recordVendorContact(deal.id)
    const msg = `Hi ${deal.customer_name}! Following up on your order for ${deal.product_name} (${formatNaira(deal.amount)}). Let me know if you are ready so I can prepare it!`
    const encoded = encodeURIComponent(msg)
    if (deal.customer_phone) {
      window.open(`https://wa.me/${deal.customer_phone.replace(/\D/g, '')}?text=${encoded}`, '_blank')
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
    }
  }

  return (
    <div className="space-y-5 pb-20">
      {/* Header Back */}
      <div className="flex items-center gap-3">
        <Link to="/deals" className="w-9 h-9 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#8E8E93] hover:text-[#F3F2EF]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-bold text-base text-[#F3F2EF]">{deal.customer_name}</h2>
          <p className="text-xs text-[#8E8E93]">{deal.product_name}</p>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
            deal.status === 'won' ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30' :
            deal.status === 'lost' ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30' :
            'bg-[#FFB020]/15 text-[#FFB020] border-[#FFB020]/30'
          }`}>
            {deal.status}
          </span>
          <span className="text-xs text-[#8E8E93]">
            {new Date(deal.captured_at).toLocaleDateString()}
          </span>
        </div>

        <div>
          <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider mb-0.5">Amount</p>
          <p className="text-3xl font-mono font-extrabold text-[#FFB020]">{formatNaira(deal.amount)}</p>
        </div>

        {deal.customer_constraint && (
          <div className="flex items-center gap-2 bg-[#0A0A0A] p-3 rounded-xl border border-[#262626] text-xs text-[#8E8E93]">
            <AlertCircle size={16} className="text-[#FFB020] shrink-0" />
            <span>{deal.customer_constraint}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {deal.status === 'open' && (
          <>
            <button
              onClick={handleFollowUp}
              className="w-full bg-[#25D366] text-[#0A0A0A] font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(37,211,102,0.2)]"
            >
              <MessageSquare size={16} />
              <span>Nudge via WhatsApp</span>
              <ExternalLink size={14} />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { markWon(deal.id); navigate('/deals') }}
                className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <CheckCircle2 size={16} />
                <span>Mark Won (₦)</span>
              </button>
              <button
                onClick={() => { markLost(deal.id); navigate('/deals') }}
                className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <XCircle size={16} />
                <span>Mark Lost</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DealDetail
