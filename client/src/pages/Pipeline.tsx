import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Clock, Plus, GripVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDeals, Deal } from '../hooks/useDeals'

interface PipelineItem {
  id: string;
  name: string;
  item: string;
  amount: string;
  time: string;
  urgent?: boolean;
}

const PipelineColumn = ({ title, count, color, bg, items }: { title: string, count: number, color: string, bg: string, items: PipelineItem[] }) => (
  <div className="flex-shrink-0 w-[280px] h-screen pb-40 flex flex-col gap-4">
    <div className={`flex items-center justify-between p-3 rounded-2xl ${bg} border border-white/5`}>
       <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`}></div>
          <span className="text-sm font-extrabold uppercase tracking-wider text-text-primary">{title}</span>
       </div>
       <span className="text-[10px] font-mono bg-white/10 text-text-muted px-2 py-0.5 rounded-full">{count}</span>
    </div>

    <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
       {items.length > 0 ? (
         items.map((item, i) => (
           <Link key={item.id} to={`/deals/${item.id}`} className="block">
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface p-4 rounded-2xl border border-white/5 relative active:border-accent group cursor-pointer"
            >
              <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-active:opacity-40"><GripVertical size={16} /></div>
              <div className="flex justify-between items-start mb-2">
                 <h4 className="font-bold text-sm truncate pr-2">{item.name}</h4>
                 <div className="text-[10px] font-mono text-text-muted font-medium">{item.time}</div>
              </div>
              <p className="text-[11px] text-text-muted mb-3">{item.item}</p>
              <div className="flex items-center justify-between">
                 <div className="text-xs font-mono font-bold">{item.amount}</div>
                 {item.urgent && <Flame size={14} className="text-hot animate-pulse" />}
              </div>
              {item.urgent && (
                 <div className="mt-2 text-[8px] font-bold text-hot uppercase tracking-widest flex items-center gap-1">
                   <Clock size={8} /> Needs Action
                 </div>
              )}
            </motion.div>
           </Link>
         ))
       ) : (
         <div className="h-24 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold text-text-muted uppercase tracking-widest gap-2">
            <Plus size={16} className="opacity-40" />
            Add Deal
         </div>
       )}
    </div>
  </div>
)

const Pipeline: React.FC = () => {
  const { deals, loading } = useDeals()

  const stages = [
    { title: 'Inquiry', status: 'inquiry', color: 'bg-yellow-400', bg: 'bg-yellow-400/5' },
    { title: 'Conversation', status: 'pending', color: 'bg-blue-400', bg: 'bg-blue-400/5' },
    { title: 'Waiting Payment', status: 'waiting_payment', color: 'bg-hot', bg: 'bg-hot/5' },
    { title: 'Paid', status: 'paid', color: 'bg-accent', bg: 'bg-accent/5' },
  ]

  const columns = stages.map(stage => {
    const stageItems = deals.filter((d: Deal) => d.status === stage.status)
    return {
      ...stage,
      count: stageItems.length,
      items: stageItems.map((d: Deal) => ({
        id: d.id,
        name: d.contacts?.name || 'Unknown',
        item: d.title,
        amount: `₦${d.amount?.toLocaleString()}`,
        time: new Date(d.created_at).toLocaleDateString(),
        urgent: d.status === 'pending'
      }))
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="py-2 -mx-4 px-4 h-full relative overflow-hidden">
      {/* Kanban Container */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-10">
        {columns.map((col, i) => (
           <PipelineColumn key={i} {...col} />
        ))}
      </div>
    </div>
  )
}

export default Pipeline
