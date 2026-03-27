import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Clock, Trash2, Send, Edit2, CheckCircle2, Calendar, Plus, MessageCircle } from 'lucide-react'
import { useReminders, Reminder } from '../hooks/useReminders'
import AddReminderModal from '../components/AddReminderModal'
import { useToast } from '../context/ToastContext'

const ReminderCard = ({ r, onDelete, onSend }: { r: Reminder, onDelete: (id: string) => void, onSend: (r: Reminder) => void }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-surface p-5 rounded-3xl border border-white/5 relative hover:border-accent/40 group transition-all space-y-4 shadow-xl"
  >
     <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
           <div className={`w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-accent`}>
              <Bell size={20} />
           </div>
           <div className="flex-1 overflow-hidden">
              <h4 className="font-bold text-base leading-tight truncate">{(r as any).deals?.title || 'General Reminder'}</h4>
              <p className="text-xs text-text-muted mt-0.5 truncate">{(r as any).deals?.contacts?.name || 'Quick Followup'}</p>
           </div>
        </div>
        <div className="bg-white/5 border border-white/5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold text-text-muted">
           {new Date(r.trigger_time).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
     </div>

     <div className="bg-surface-2/50 border border-white/5 p-4 rounded-2xl italic text-sm text-text-primary leading-relaxed relative group">
        <MessageCircle size={14} className="absolute -top-1 -left-1 text-accent opacity-40" />
        "{r.message}"
     </div>

     <div className="flex gap-2 pt-2">
        <button className="flex-1 py-3 bg-surface-2 rounded-xl text-xs font-bold text-text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-1.5 active:bg-white/5 border border-white/5">
           <Edit2 size={14} /> Edit
        </button>
        <button 
          onClick={() => onSend(r)}
          className="flex-1 py-3 bg-accent/10 rounded-xl text-xs font-bold text-accent hover:bg-accent/20 transition-colors flex items-center justify-center gap-1.5 border border-accent/10"
        >
           <Send size={14} /> Send Now
        </button>
        <button 
          onClick={() => onDelete(r.id)}
          className="w-12 py-3 bg-hot/10 rounded-xl text-hot flex items-center justify-center hover:bg-hot/20 transition-colors border border-hot/10"
        >
           <Trash2 size={16} />
        </button>
     </div>
  </motion.div>
)

const Reminders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { reminders, loading, deleteReminder, refresh } = useReminders()
  const { toast } = useToast()

  const upcoming = reminders.filter(r => r.status === 'pending')
  const sent = reminders.filter(r => r.status === 'sent')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-accent py-20">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="pb-24 pt-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 px-2">
        <h2 className="text-3xl font-syne font-extrabold">Reminders</h2>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-accent text-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus size={16} /> Add New
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
             activeTab === 'upcoming' 
             ? 'bg-accent text-primary border-accent shadow-lg' 
             : 'bg-surface-2 text-text-muted border-white/5 hover:border-accent/40'
          }`}
        >
          <Clock size={14} /> Upcoming <span className="text-[10px] opacity-70">({upcoming.length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
             activeTab === 'sent' 
             ? 'bg-accent text-primary border-accent shadow-lg' 
             : 'bg-surface-2 text-text-muted border-white/5 hover:border-accent/40'
          }`}
        >
          <CheckCircle2 size={14} /> Sent <span className="text-[10px] opacity-70">({sent.length})</span>
        </button>
      </div>

      {/* Reminder List */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'upcoming' ? (
            <motion.div 
              key="upcoming-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {upcoming.length > 0 ? (
                upcoming.map((r) => (
                  <ReminderCard key={r.id} r={r} onDelete={deleteReminder} onSend={() => toast('Sending reminder...', 'info')} />
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center">
                   <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                     <Clock size={32} />
                   </div>
                   <h3 className="text-lg font-bold">All caught up! 🔥</h3>
                   <p className="text-text-muted text-sm px-10">You have no upcoming follow-ups scheduled.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="sent-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {sent.length > 0 ? (
                sent.map((r) => (
                  <ReminderCard key={r.id} r={r} onDelete={deleteReminder} onSend={() => {}} />
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center">
                   <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-text-muted mb-4 border border-white/5 opacity-40">
                     <CheckCircle2 size={32} />
                   </div>
                   <h3 className="text-lg font-bold">No sent reminders</h3>
                   <p className="text-text-muted text-sm px-10">Reminders you've sent will appear here.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Calendar Teaser */}
      <div className="mt-12 p-8 bg-gradient-to-br from-surface to-surface-2 rounded-[40px] border border-white/5 border-dashed text-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent/60">
               <Calendar size={24} />
            </div>
            <div className="space-y-1">
               <h4 className="text-sm font-bold uppercase tracking-widest text-text-primary">Monthly Overview</h4>
               <p className="text-xs text-text-muted px-4">You have {upcoming.length} reminders scheduled for the rest of this week.</p>
            </div>
            <button className="px-6 py-2 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase rounded-lg hover:bg-accent/20 transition-all">
               View Calendar
            </button>
         </div>
      </div>

      <AddReminderModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => refresh()} 
      />
    </div>
  )
}

export default Reminders
