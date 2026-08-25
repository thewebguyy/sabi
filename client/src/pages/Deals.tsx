import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, MessageCircle, AlertCircle, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { DealStatus } from '../types'

export const Deals: React.FC = () => {
  const { deals, markWon, markLost, recordVendorContact } = useStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<DealStatus>('open')

  const filteredDeals = deals.filter(d => d.status === filter)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val)
  }

  const handleQuickFollowUp = (id: string, phone: string | null, product: string, amount: number, name: string) => {
    recordVendorContact(id)
    const msg = `Hi ${name}! Following up on your order for ${product} (${formatCurrency(amount)}). Let me know if you are ready so I can prepare it for you!`
    const encoded = encodeURIComponent(msg)
    if (phone) {
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`, '_blank')
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
    }
  }

  return (
    <div className="space-y-5">
      {/* Segmented Filter Pills */}
      <div className="flex bg-[#141414] p-1 rounded-2xl border border-[#262626]">
        {(['open', 'won', 'lost'] as DealStatus[]).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold capitalize transition-all ${
              filter === st
                ? 'bg-[#FFB020] text-[#0A0A0A] shadow-[0_0_15px_rgba(255,176,32,0.2)]'
                : 'text-[#8E8E93] hover:text-[#F3F2EF]'
            }`}
          >
            {st} ({deals.filter(d => d.status === st).length})
          </button>
        ))}
      </div>

      {/* List */}
      {filteredDeals.length === 0 ? (
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 text-center space-y-3">
          <p className="text-xs text-[#8E8E93]">No {filter} opportunities found.</p>
          {filter === 'open' && (
            <button
              onClick={() => navigate('/capture')}
              className="inline-flex items-center gap-1.5 bg-[#FFB020] text-[#0A0A0A] font-extrabold px-4 py-2 rounded-xl text-xs"
            >
              <PlusCircle size={14} />
              <span>Capture New Deal</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#141414] border border-[#262626] rounded-2xl p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-[#F3F2EF]">{deal.customer_name}</h4>
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

                {filter === 'open' && (
                  <div className="flex items-center gap-2 pt-1 border-t border-[#262626]/50">
                    <button
                      onClick={() => handleQuickFollowUp(deal.id, deal.customer_phone, deal.product_name, deal.amount, deal.customer_name)}
                      className="flex-1 bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp Nudge</span>
                    </button>
                    <button
                      onClick={() => markWon(deal.id)}
                      className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 p-2 rounded-xl hover:bg-[#10B981]/25 active:scale-95 transition-all"
                      title="Mark Won"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <button
                      onClick={() => markLost(deal.id)}
                      className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 p-2 rounded-xl hover:bg-[#EF4444]/25 active:scale-95 transition-all"
                      title="Mark Lost"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                )}

                {filter === 'won' && (
                  <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold pt-1">
                    <CheckCircle2 size={14} />
                    <span>Revenue Recovered: {formatCurrency(deal.amount)}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default Deals
