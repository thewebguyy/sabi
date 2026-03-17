import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserPlus, Phone, MessageSquare, ShieldCheck, Clock, ChevronRight, Hash, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

const TrustScore = ({ score }: { score: number }) => {
  const color = score >= 80 ? 'bg-accent' : score >= 50 ? 'bg-gold' : 'bg-hot'
  return (
    <div className="flex flex-col gap-1 w-full max-w-[80px]">
       <div className="flex justify-between items-center text-[8px] font-bold text-text-muted uppercase tracking-widest leading-none">
          <span>Trust</span>
          <span className={color.replace('bg-', 'text-')}>{score}%</span>
       </div>
       <div className="h-1 bg-surface-2 rounded-full border border-white/5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            className={`h-full ${color}`}
          />
       </div>
    </div>
  )
}

const ContactCard = ({ name, phone, deals, revenue, lastSeen, score, avatarColor }: any) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="bg-surface p-4 rounded-3xl border border-white/5 relative active:border-accent group cursor-pointer transition-all"
  >
     <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-syne font-extrabold text-xl ${avatarColor}`}>
           {name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
           <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-base truncate pr-2">{name}</h4>
              <span className="text-[10px] font-mono text-text-muted whitespace-nowrap">{lastSeen}</span>
           </div>
           <div className="flex items-center gap-2 mb-3">
              <Phone size={10} className="text-text-muted" />
              <span className="text-xs font-mono text-text-muted">{phone}</span>
           </div>
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1 bg-surface-2 px-2 py-0.5 rounded-lg border border-white/5">
                    <Hash size={10} className="text-accent" />
                    <span className="text-[10px] font-bold text-text-primary">{deals} Deals</span>
                 </div>
                 <div className="text-[10px] font-mono font-bold text-accent">₦{revenue.toLocaleString()}</div>
              </div>
              <TrustScore score={score} />
           </div>
        </div>
        <ChevronRight size={18} className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
     </div>
  </motion.div>
)

const Contacts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const allContacts = [
    { name: 'Chidinma Okechukwu', phone: '+234 801 223 4455', deals: 4, revenue: 450000, lastSeen: '2h', score: 92, avatarColor: 'bg-accent/10 text-accent border border-accent/20' },
    { name: 'Kunle Adebayo', phone: '+234 905 112 3344', deals: 12, revenue: 1250000, lastSeen: '5h', score: 85, avatarColor: 'bg-gold/10 text-gold border border-gold/20' },
    { name: 'Blessing Falz', phone: '+234 812 334 5566', deals: 2, revenue: 85000, lastSeen: '1d', score: 45, avatarColor: 'bg-hot/10 text-hot border border-hot/20' },
    { name: 'Emeka Thompson', phone: '+234 703 445 6677', deals: 8, revenue: 420000, lastSeen: '2d', score: 78, avatarColor: 'bg-blue-400/10 text-blue-400 border border-blue-400/20' },
    { name: 'Musa Dankwa', phone: '+233 24 556 7788', deals: 1, revenue: 15000, lastSeen: '1w', score: 32, avatarColor: 'bg-white/10 text-text-muted border border-white/10' },
  ]

  const filteredContacts = allContacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  )

  return (
    <div className="pb-24 pt-4">
      {/* Header & Search */}
      <div className="mb-8 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-3xl font-syne font-extrabold flex items-center gap-2">
             Contacts
          </h2>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-2xl bg-accent text-primary flex items-center justify-center shadow-[0_5px_15px_rgba(37,211,102,0.3)] border border-white/10"
          >
            <UserPlus size={20} />
          </motion.button>
        </div>

        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
           <input 
             type="text" 
             placeholder="Search by name or number..."
             className="w-full bg-surface rounded-2xl border border-white/5 py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/40 transition-all font-body text-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
           <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors">
              <Filter size={16} />
           </button>
        </div>
      </div>

      {/* Contact List */}
      <div className="space-y-4">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((c, i) => (
             <ContactCard key={i} {...c} />
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-text-muted mb-4 border border-white/5 opacity-40">
               <Search size={32} />
             </div>
             <h3 className="text-lg font-bold">No contacts found</h3>
             <p className="text-text-muted text-sm px-10">Try a different name or phone number.</p>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-12 p-8 bg-surface-2/50 rounded-[40px] border border-white/5 border-dashed text-center">
         <div className="flex justify-around items-center">
            <div className="space-y-1">
               <div className="text-xl font-mono font-extrabold text-accent">542</div>
               <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Total Custy</div>
            </div>
            <div className="w-[1px] h-8 bg-white/5"></div>
            <div className="space-y-1">
               <div className="text-xl font-mono font-extrabold text-accent">₦4.8M</div>
               <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Pipe Value</div>
            </div>
            <div className="w-[1px] h-8 bg-white/5"></div>
            <div className="space-y-1">
               <div className="text-xl font-mono font-extrabold text-accent">86%</div>
               <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Lead Qual</div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default Contacts
