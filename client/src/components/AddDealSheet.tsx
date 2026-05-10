import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, ShoppingBag, DollarSign, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

interface AddDealSheetProps {
  isOpen: boolean
  onClose: () => void
}

const AddDealSheet: React.FC<AddDealSheetProps> = ({ isOpen, onClose }) => {
  const { user, fetchDeals } = useStore()
  const [contactInfo, setContactInfo] = useState('')
  const [product, setProduct] = useState('')
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setContactInfo('')
    setProduct('')
    setAmount('')
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !contactInfo.trim() || !product.trim()) return
    setSaving(true)
    setError(null)

    try {
      // Resolve or create contact
      const isPhone = /^\+?[0-9\s]{10,15}$/.test(contactInfo.trim())
      const phoneFallback = isPhone ? contactInfo.replace(/\s/g, '') : `+000${Date.now()}`

      const { data: existing } = await supabase
        .from('contacts')
        .select('id')
        .eq('user_id', user.id)
        .or(`phone.eq.${contactInfo.trim()},name.ilike.${contactInfo.trim()}`)
        .maybeSingle()

      let contactId: string

      if (existing) {
        contactId = existing.id
      } else {
        const { data: newContact, error: cErr } = await supabase
          .from('contacts')
          .insert([{
            user_id: user.id,
            name: isPhone ? contactInfo.trim() : contactInfo.trim(),
            phone: phoneFallback,
            last_seen: new Date()
          }])
          .select()
          .single()
        if (cErr) throw cErr
        contactId = newContact.id
      }

      // Create deal
      const { error: dErr } = await supabase.from('deals').insert([{
        user_id: user.id,
        contact_id: contactId,
        title: product.trim(),
        amount: parseFloat(amount) || 0,
        status: 'inquiry',
        last_contact_time: new Date().toISOString(),
        summary: '',
      }])
      if (dErr) throw dErr

      await fetchDeals()
      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 1200)

    } catch (err: any) {
      setError(err.message || 'Failed to save deal')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-surface rounded-t-[36px] border-t border-white/10 shadow-2xl z-[110] overflow-y-auto no-scrollbar"
          >
            <div className="p-6 pb-10">
              <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold text-text-primary">Add Deal</h3>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-text-muted"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {error && (
                  <div className="bg-hot/10 border border-hot/20 rounded-2xl px-4 py-3 text-hot text-xs font-bold">
                    {error}
                  </div>
                )}

                {/* Customer */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Customer Name or Phone *
                  </label>
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Chidinma or +234..."
                      className="w-full bg-surface-2 rounded-2xl border border-white/5 py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/40 transition-all font-body text-sm"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Product */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Product / Service *
                  </label>
                  <div className="relative group">
                    <ShoppingBag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ankara Fabric (6 yards)"
                      className="w-full bg-surface-2 rounded-2xl border border-white/5 py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/40 transition-all font-body text-sm"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    Amount (optional)
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">₦</span>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      className="w-full bg-surface-2 rounded-2xl border border-white/5 py-4 pl-10 pr-4 text-text-primary outline-none focus:border-accent/40 transition-all font-mono text-sm"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving || success}
                  className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-base shadow-[0_10px_30px_rgba(37,211,102,0.3)] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving
                    ? <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    : success
                    ? <><CheckCircle2 size={22} /> Saved!</>
                    : 'Save Deal'
                  }
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddDealSheet
