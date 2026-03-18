import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, ShoppingBag, StickyNote, Bell, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import axios from 'axios'

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDealModal: React.FC<AddDealModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useStore()
  const [extracting, setExtracting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [magicText, setMagicText] = useState('')
  
  // Form State
  const [contactInfo, setContactInfo] = useState('')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('pending')
  const [summary, setSummary] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleMagicExtract = async () => {
    if (!magicText) return
    setExtracting(true)
    setError(null)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/extract-deal`, { 
        chatText: magicText 
      }, {
        headers: { Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` }
      })
      
      const data = response.data
      if (data) {
        setTitle(data.title || '')
        setAmount(data.amount?.toString() || '')
        setSummary(data.summary || '')
        // We still need contact name, usually extracted from chat too or asked manually
      }
    } catch (err: any) {
      console.error(err)
      setError('AI Extraction failed. Try manual entry.')
    } finally {
      setExtracting(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !contactInfo || !title) return
    
    setSaving(true)
    setError(null)
    try {
      // 1. Resolve or Create Contact
      let contactId: string
      const isPhone = /^\+?[0-9]{10,15}$/.test(contactInfo.replace(/\s/g, ''))
      const phoneValue = isPhone ? contactInfo.replace(/\s/g, '') : `guest_${Date.now()}`

      const { data: existingContact } = await supabase
        .from('contacts')
        .select('id')
        .or(`phone.eq.${contactInfo},name.eq.${contactInfo}`)
        .eq('user_id', user.id)
        .single()

      if (existingContact) {
        contactId = existingContact.id
      } else {
        const { data: newContact, error: contactError } = await supabase
          .from('contacts')
          .insert([{
            user_id: user.id,
            name: contactInfo,
            phone: phoneValue,
            last_seen: new Date()
          }])
          .select()
          .single()
        
        if (contactError) throw contactError
        contactId = newContact.id
      }

      // 2. Create Deal
      const { error: dealError } = await supabase
        .from('deals')
        .insert([{
          user_id: user.id,
          contact_id: contactId,
          title,
          amount: parseFloat(amount) || 0,
          status,
          summary: summary || 'Manually added deal',
          created_at: new Date()
        }])

      if (dealError) throw dealError

      // Refresh store deals
      await useStore.getState().fetchDeals()

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
        if (onSuccess) onSuccess()
      }, 1500)

    } catch (err: any) {
      console.error(err)
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
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-surface rounded-t-[40px] border-t border-white/10 shadow-2xl z-[110] overflow-y-auto no-scrollbar"
          >
            <div className="p-8 pb-12 space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-syne font-extrabold text-text-primary">New Deal</h3>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary active:scale-95 transition-all"
                  >
                     <X size={20} />
                  </button>
               </div>

               {/* AI Extraction Section */}
               <div className="bg-primary/20 p-5 rounded-3xl border border-accent/20 space-y-4">
                  <div className="flex items-center gap-2">
                     <Sparkles size={18} className="text-accent" />
                     <span className="text-xs font-syne font-extrabold text-accent uppercase tracking-widest leading-none">Magic Extract</span>
                  </div>
                  <textarea 
                    className="w-full h-24 bg-surface-2/50 border border-white/5 rounded-2xl p-4 text-sm text-text-primary outline-none focus:border-accent/40 transition-all placeholder:text-text-muted/40 resize-none"
                    placeholder="Paste a WhatsApp chat here... Sabi will auto-fill the form."
                    value={magicText}
                    onChange={(e) => setMagicText(e.target.value)}
                  />
                  <button 
                    onClick={handleMagicExtract}
                    disabled={extracting || !magicText}
                    className="w-full py-3 bg-accent/10 text-accent font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-accent/20 transition-all disabled:opacity-50"
                  >
                     {extracting ? <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div> : (
                        <>
                           Extract with Sabi AI <Sparkles size={14} />
                        </>
                     )}
                  </button>
               </div>

               <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-center mb-[-1rem]">OR MANUALLY FILL</div>

               {/* Manual Form */}
               <form onSubmit={handleSave} className="space-y-6">
                  {error && <div className="p-4 bg-hot/10 border border-hot/20 rounded-2xl text-hot text-xs font-bold text-center">{error}</div>}
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Contact Name / Phone</label>
                     <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. Chidinma O. or +234..."
                           className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-accent/40 transition-all font-body"
                           value={contactInfo}
                           onChange={(e) => setContactInfo(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">What are they buying?</label>
                     <div className="relative group">
                        <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. Ankara Fabric (6 yards)"
                           className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-accent/40 transition-all font-body"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Amount</label>
                        <div className="relative group">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">₦</div>
                           <input 
                              type="number" 
                              placeholder="0"
                              className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-10 pr-4 text-sm text-text-primary outline-none focus:border-accent/40 transition-all font-mono"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Status</label>
                        <div className="relative group">
                           <select 
                              className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-4 pr-10 text-sm text-text-primary outline-none focus:border-accent/40 transition-all appearance-none cursor-pointer"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                           >
                              <option value="inquiry">New Inquiry</option>
                              <option value="pending">Conversation</option>
                              <option value="waiting_payment">Waiting Payment</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={18} />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Notes / Constraints</label>
                     <div className="relative group">
                        <StickyNote className="absolute left-4 top-4 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                        <textarea 
                           placeholder="e.g. Needs it by Friday..."
                           className="w-full h-24 bg-surface-2 border border-white/5 rounded-2xl p-4 pl-12 text-sm text-text-primary outline-none focus:border-accent/40 transition-all resize-none font-body"
                           value={summary}
                           onChange={(e) => setSummary(e.target.value)}
                        />
                     </div>
                  </div>

                  <button 
                     type="submit" 
                     disabled={saving || showSuccess}
                     className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg shadow-[0_15px_30px_rgba(37,211,102,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                     {saving ? <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> : (
                        showSuccess ? (
                           <>
                              Saved Successfully! <CheckCircle2 size={24} />
                           </>
                        ) : 'Save Deal'
                     )}
                  </button>
               </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddDealModal
