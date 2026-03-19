import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { error } = await supabase
        .from('contacts')
        .insert([{
          user_id: user.id,
          name,
          phone,
          last_seen: new Date()
        }])

      if (error) throw error
      
      onSuccess?.()
      onClose()
      setName('')
      setPhone('')
    } catch (err) {
      console.error(err)
      alert('Failed to add contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="relative bg-surface w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] border border-white/10 p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-syne font-extrabold text-white">Add New Contact</h3>
               <button onClick={onClose} className="p-2 bg-surface-2 rounded-xl text-text-muted hover:text-white">
                 <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Full Name</label>
                  <div className="relative group">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                     <input 
                       required
                       type="text" 
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="e.g. Chidinma"
                       className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/40"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">WhatsApp Number</label>
                  <div className="relative group">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                     <input 
                       required
                       type="tel" 
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       placeholder="e.g. +2348000000000"
                       className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/40 font-mono"
                     />
                  </div>
               </div>

               <button 
                 type="submit"
                 disabled={loading}
                 className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,211,102,0.2)] disabled:opacity-50 mt-4"
               >
                 {loading ? <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> : (
                   <>
                     Save Contact
                     <CheckCircle2 size={24} />
                   </>
                 )}
               </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddContactModal
