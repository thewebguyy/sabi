import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Clock, Eye, CheckCircle2, Plus, MessageCircle, MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import AddDealModal from '../components/AddDealModal'

const MetricCard = ({ icon, label, count, color, bg }: { icon: React.ReactNode, label: string, count: string, color: string, bg: string }) => (
  <div className={`flex-shrink-0 w-40 p-4 rounded-3xl border border-white/5 ${bg} space-y-3`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color} bg-white/10`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-mono font-bold text-text-primary">{count}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{label}</div>
    </div>
  </div>
)

const DealCard = ({ name, summary, time, status, amount, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface p-4 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden active:scale-[0.98] transition-transform"
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${color} bg-white/5`}>
        {name[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-base truncate pr-2">{name}</h4>
          <span className="text-[10px] font-mono text-text-muted whitespace-nowrap">{time}</span>
        </div>
        <p className="text-sm text-text-muted truncate mb-2">{summary}</p>
        <div className="flex items-center justify-between">
           <div className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-tight ${
              status === 'inquiry' ? 'bg-accent/10 text-accent' : 
              status === 'pending' ? 'bg-hot/10 text-hot' : 
              status === 'paid' ? 'bg-success/10 text-success' :
              'bg-blue-500/10 text-blue-400'
           }`}>
             {status}
           </div>
           {amount && <div className="text-sm font-mono font-bold text-text-primary">{amount}</div>}
        </div>
      </div>
    </div>
    <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
       <button className="flex-1 py-2 bg-surface-2 rounded-xl text-xs font-bold text-text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-1.5">
         <Clock size={14} /> Snooze
       </button>
       <button className="flex-1 py-2 bg-accent/10 rounded-xl text-xs font-bold text-accent hover:bg-accent/20 transition-colors flex items-center justify-center gap-1.5">
         <MessageCircle size={14} /> Reply
       </button>
    </div>
  </motion.div>
)

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('follow-up')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const metrics = [
    { icon: <Flame size={16} />, label: 'Hot Leads', count: '12', color: 'text-hot', bg: 'bg-hot/5 border-hot/10' },
    { icon: <Clock size={16} />, label: 'Waiting', count: '4', color: 'text-yellow-400', bg: 'bg-yellow-400/5 border-yellow-400/10' },
    { icon: <Eye size={16} />, label: 'Pending', count: '15', color: 'text-blue-400', bg: 'bg-blue-400/5 border-blue-400/10' },
    { icon: <CheckCircle2 size={16} />, label: 'Revenue', count: '₦1.2M', color: 'text-accent', bg: 'bg-accent/5 border-accent/10' },
  ]

  const followUpDeals = [
    { name: 'Chidinma', summary: 'Waiting for blue fabric choice', time: '14h ago', status: 'pending', amount: '₦15,000', color: 'text-accent' },
    { name: 'Emeka', summary: 'Asking for logistics to Abuja', time: '18h ago', status: 'inquiry', amount: '₦4,500', color: 'text-hot' },
    { name: 'Ayo', summary: 'Needs size 44 in black', time: '22h ago', status: 'inquiry', amount: '₦22,000', color: 'text-blue-400' },
  ]

  const allDeals = [
    ...followUpDeals,
    { name: 'Blessing', summary: 'Order confirmed', time: '2d ago', status: 'paid', amount: '₦45,000', color: 'text-green-500' },
    { name: 'Kunle', summary: 'Sample sent', time: '3d ago', status: 'pending', amount: '₦0', color: 'text-text-muted' },
  ]

  return (
    <div className="pb-10 pt-4">
      {/* Metric Strip */}
      <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar">
        {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-surface-2 p-1 rounded-2xl flex relative h-12">
        <motion.div 
          className="absolute inset-1 bg-surface rounded-xl shadow-lg border border-white/5"
          initial={false}
          animate={{ x: activeTab === 'follow-up' ? '0%' : '100%', width: '48%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button 
          onClick={() => setActiveTab('follow-up')}
          className={`flex-1 relative z-10 text-sm font-bold transition-colors ${activeTab === 'follow-up' ? 'text-accent' : 'text-text-muted'}`}
        >
          Follow Up
          {followUpDeals.length > 0 && <span className="ml-2 bg-hot text-primary text-[10px] px-1.5 py-0.5 rounded-full">{followUpDeals.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('all-deals')}
          className={`flex-1 relative z-10 text-sm font-bold transition-colors ${activeTab === 'all-deals' ? 'text-accent' : 'text-text-muted'}`}
        >
          All Deals
        </button>
      </div>

      {/* Magic List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'follow-up' ? (
            <motion.div 
              key="follow-up-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {followUpDeals.length > 0 ? (
                followUpDeals.map((d, i) => (
                  <Link key={i} to={`/deals/${i}`}>
                    <DealCard {...d} className="mb-4" />
                  </Link>
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center">
                   <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4">
                     <CheckCircle2 size={32} />
                   </div>
                   <h3 className="text-lg font-bold">You're all caught up! 🎉</h3>
                   <p className="text-text-muted text-sm px-10">No follow-ups right now. Sabi is watching your chats.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="all-deals-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                 {['All', 'Inquiry', 'Pending', 'Paid', 'Ghosted'].map(chip => (
                   <button key={chip} className="px-4 py-1.5 bg-surface-2 border border-white/5 rounded-full text-xs font-bold text-text-muted whitespace-nowrap hover:bg-surface active:border-accent transition-all">
                     {chip}
                   </button>
                 ))}
              </div>
              {allDeals.map((d, i) => (
                 <Link key={i} to={`/deals/${i}`}>
                   <DealCard {...d} />
                 </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAB */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-accent text-primary rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] flex items-center justify-center z-50 border-4 border-background"
      >
        <Plus size={28} />
      </motion.button>

      <AddDealModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}

export default Dashboard
