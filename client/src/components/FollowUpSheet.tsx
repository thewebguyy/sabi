import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit3, Send, Link2 } from 'lucide-react'
import { Deal } from '../store/useStore'
import axios from 'axios'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { trackMilestone, trackEvent } from '../lib/analytics'

interface FollowUpSheetProps {
  deal: Deal
  onClose: () => void
}

const FollowUpSheet: React.FC<FollowUpSheetProps> = ({ deal, onClose }) => {
  const { updateDeal } = useStore()
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [generating, setGenerating] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [generatingLink, setGeneratingLink] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateMessage()
  }, [])

  const generateMessage = async () => {
    setGenerating(true)
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const { data: { session } } = await supabase.auth.getSession()
      const res = await axios.post(`${apiUrl}/api/deals/${deal.id}/follow-up`, {}, {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
      })
      setMessage(res.data.message || getFallbackMessage())
    } catch {
      setMessage(getFallbackMessage())
    } finally {
      setGenerating(false)
    }
  }

  const getFallbackMessage = () => {
    const name = deal.customer_name?.split(' ')[0] || 'there'
    const product = deal.product_name
    return `Hi ${name}! Just checking in on the ${product}. Are you still interested? Let me know if you have any questions 😊`
  }

  const handleSend = async () => {
    setSending(true)
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const { data: { session } } = await supabase.auth.getSession()
      await axios.post(`${apiUrl}/api/deals/${deal.id}/follow-up`, {
        message,
        send: true
      }, {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
      })
      await updateDeal(deal.id, { last_vendor_contact_at: new Date().toISOString() })
      trackMilestone('first_followup', { deal_id: deal.id, method: 'direct_send' })
      setSent(true)
      setTimeout(onClose, 1200)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handlePaymentLink = async () => {
    setGeneratingLink(true)
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const { data: { session } } = await supabase.auth.getSession()
      const res = await axios.post(`${apiUrl}/api/payments/generate-link`, {
        deal_id: deal.id,
        amount: deal.amount,
        customer_phone: deal.customer_phone
      }, {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
      })
      const paymentUrl = res.data.payment_url;
      const name = deal.customer_name?.split(' ')[0] || 'there';
      const text = `Hi ${name}! Here's your payment link for ${deal.product_name}:\n${paymentUrl} — ₦${deal.amount}`;
      const encoded = encodeURIComponent(text);
      const phone = deal.customer_phone ? deal.customer_phone.replace(/\D/g, '') : '';
      trackMilestone('first_followup', { deal_id: deal.id, method: 'payment_link' });
      trackEvent('whatsapp_opened', { deal_id: deal.id, action: 'payment_link' });
      window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate payment link')
    } finally {
      setGeneratingLink(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
        className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-surface rounded-t-[36px] border-t border-white/10 shadow-2xl z-[110] overflow-y-auto no-scrollbar"
      >
        <div className="p-6 pb-10">
          <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-6" />

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-extrabold text-text-primary">Follow Up</h3>
            <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-text-muted">
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-text-muted mb-4">
            Suggested message to <span className="text-text-primary font-bold">{deal.customer_name || 'customer'}:</span>
          </p>

          {/* Message Block */}
          <div className="relative mb-6">
            {generating ? (
              <div className="bg-surface-2 rounded-3xl p-6 border border-white/5 min-h-[100px] flex items-center justify-center">
                <div className="flex items-center gap-3 text-text-muted">
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Generating message…</span>
                </div>
              </div>
            ) : isEditing ? (
              <textarea
                autoFocus
                className="w-full bg-surface-2 rounded-3xl border border-accent/30 p-5 text-sm text-text-primary outline-none resize-none font-body min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            ) : (
              <div className="bg-surface-2 rounded-3xl p-5 border border-white/5 text-sm text-text-primary leading-relaxed">
                {message}
              </div>
            )}

            {!generating && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-accent transition-colors"
              >
                <Edit3 size={14} />
              </button>
            )}
          </div>

          {error && (
            <div className="bg-hot/10 border border-hot/20 rounded-2xl px-4 py-3 text-hot text-xs font-bold mb-4">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSend}
              disabled={sending || generating || sent || !message.trim()}
              className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-base shadow-[0_10px_30px_rgba(37,211,102,0.3)] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending
                ? <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                : sent
                ? '✓ Sent!'
                : <><Send size={18} /> Send Now</>
              }
            </button>

            <button
              onClick={handlePaymentLink}
              disabled={sending || generating || generatingLink}
              className="w-full bg-surface-2 text-text-primary font-bold py-5 rounded-2xl text-base active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 border border-white/5"
            >
              {generatingLink
                ? <div className="w-5 h-5 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
                : <><Link2 size={18} /> Send Payment Link</>
              }
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-sm text-text-muted/60 font-bold text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default FollowUpSheet
