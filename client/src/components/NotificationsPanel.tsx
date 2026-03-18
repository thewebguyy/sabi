import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Flame, DollarSign, Clock, PartyPopper, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store/useStore'

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationItem = ({ icon, title, message, time, color }: any) => (
  <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
     <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${color} bg-white/5`}>
           {icon}
        </div>
        <div className="flex-1 space-y-1">
           <div className="flex justify-between items-start">
              <h4 className="text-sm font-bold text-text-primary leading-tight pr-4">{title}</h4>
              <span className="text-[8px] font-mono text-text-muted whitespace-nowrap">{time}</span>
           </div>
           <p className="text-xs text-text-muted leading-relaxed">{message}</p>
        </div>
     </div>
  </div>
)

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { deals } = useStore()
  
  // Real notifications
  const derivedNotifications = [
    ...deals
      .filter((d: any) => d.status === 'pending')
      .slice(0, 2)
      .map((d: any) => ({
        icon: <Flame size={18} />,
        title: `${d.contacts?.name || 'Customer'} hasn't replied to your price`,
        message: `It's been a while. Follow up before the deal for "${d.title}" goes cold! 🔥`,
        time: "Now",
        color: "text-hot"
      })),
    ...deals
      .filter((d: any) => d.status === 'waiting_payment')
      .slice(0, 2)
      .map((d: any) => ({
        icon: <DollarSign size={18} />,
        title: `Pending payment for ${d.title}`,
        message: `Awaiting payment verification for ₦${d.amount?.toLocaleString()}. 💰`,
        time: "Active",
        color: "text-accent"
      }))
  ]

  // Fallback/System notifications
  const notifications = derivedNotifications.length > 0 ? derivedNotifications : [
    { 
       icon: <PartyPopper size={18} />, 
       title: "Welcome to Sabi! 🎉", 
       message: "We're watching your chats to find deals for you. Go hustle! 💚", 
       time: "1d ago", 
       color: "text-success" 
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-surface-2 border-l border-white/5 shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface">
               <div className="flex items-center gap-3">
                  <h3 className="text-xl font-syne font-extrabold">Notifications</h3>
                  <span className="bg-hot text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{notifications.length}</span>
               </div>
               <button 
                 onClick={onClose}
                 className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary"
               >
                  <X size={20} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
               {notifications.map((n, i) => (
                  <NotificationItem key={i} {...n} />
               ))}
               
               {notifications.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
                     <CheckCircle2 size={48} className="mb-4" />
                     <p className="font-bold text-sm">Nothing to chase right now. 🎉</p>
                  </div>
               )}
            </div>

            <div className="p-6 border-t border-white/5 bg-surface text-center">
               <button className="text-xs font-bold text-accent uppercase tracking-widest hover:text-text-primary transition-colors">
                  Mark all as read
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationsPanel
