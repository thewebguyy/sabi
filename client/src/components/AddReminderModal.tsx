import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [message, setMessage] = useState('')
  const [dealId, setDealId] = useState('')
  const [triggerTime, setTriggerTime] = useState('')
  const [loading, setLoading] = useState(false)
  const { deals } = useStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { error } = await supabase
        .from('reminders')
        .insert([{
          user_id: user.id,
          deal_id: dealId || null,
          trigger_time: new Date(triggerTime).toISOString(),
          message,
          status: 'pending'
        }])

      if (error) throw error
      
      onSuccess?.()
      onClose()
      setMessage('')
      setDealId('')
      setTriggerTime('')
    } catch (err) {
      console.error(err)
      alert('Failed to add reminder')
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
               <h3 className="text-2xl font-syne font-extrabold text-white">Create Reminder</h3>
               <button onClick={onClose} className="p-2 bg-surface-2 rounded-xl text-text-muted hover:text-white">
                 <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">What to remember?</label>
                  <input 
                    required
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Follow up on the payment"
                    className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 px-4 outline-none focus:border-accent/40"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Link to Deal (Optional)</label>
                  <select 
                    value={dealId}
                    onChange={(e) => setDealId(e.target.value)}
                    className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 px-4 outline-none focus:border-accent/40 text-sm"
                  >
                    <option value="">No Deal</option>
                    {deals.map(d => (
                      <option key={d.id} value={d.id}>{d.contacts?.name}: {d.title}</option>
                    ))}
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">When?</label>
                  <div className="relative group">
                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                     <input 
                       required
                       type="datetime-local" 
                       value={triggerTime}
                       onChange={(e) => setTriggerTime(e.target.value)}
                       className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/40"
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
                     Create Reminder
                     <Clock size={24} />
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

export default AddReminderModal
