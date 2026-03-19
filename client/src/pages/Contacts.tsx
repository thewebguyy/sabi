import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserPlus, Phone, MessageSquare, ShieldCheck, Clock, ChevronRight, Hash, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useContacts, Contact } from '../hooks/useContacts'
import { useStore, Deal } from '../store/useStore'
import AddContactModal from '../components/AddContactModal'

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { contacts, loading: contactsLoading, refresh: refreshContacts } = useContacts()
  const { deals, loading: dealsLoading } = useStore()

  // Derive stats per contact
  const contactsWithStats = contacts.map((c: Contact) => {
    const contactDeals = deals.filter((d: Deal) => d.contact_id === c.id)
    const revenue = contactDeals.filter((d: Deal) => d.status === 'paid').reduce((sum: number, d: Deal) => sum + (d.amount || 0), 0)
    
    // Simple score calculation (MVP)
    const calculateTrustScore = (dealCount: number, revenue: number) => {
      let score = 20; // Base score
      score += Math.min(50, dealCount * 10); // Frequency (up to 50 points)
      score += Math.min(30, Math.floor(revenue / 5000)); // Volume (up to 30 points)
      return Math.min(100, score);
    };

    const score = calculateTrustScore(contactDeals.length, revenue);

    const avatarColors = [
      'bg-accent/10 text-accent border border-accent/20',
      'bg-blue-400/10 text-blue-400 border border-blue-400/20',
      'bg-gold/10 text-gold border border-gold/20',
    ]
    const avatarColor = avatarColors[c.id.length % avatarColors.length]

    return {
      name: c.name,
      phone: c.phone,
      deals: contactDeals.length,
      revenue,
      lastSeen: c.last_seen ? new Date(c.last_seen).toLocaleDateString() : 'Never',
      score,
      avatarColor
    }
  })

  const filteredContacts = contactsWithStats.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  )

  if (contactsLoading || dealsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-accent">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

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
            onClick={() => setIsAddModalOpen(true)}
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
               <div className="text-xl font-mono font-extrabold text-accent">{contacts.length}</div>
               <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Total Custy</div>
            </div>
            <div className="w-[1px] h-8 bg-white/5"></div>
            <div className="space-y-1">
               <div className="text-xl font-mono font-extrabold text-accent">₦{deals.reduce((sum: number, d: Deal) => sum + (d.amount || 0), 0).toLocaleString()}</div>
               <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Pipe Value</div>
            </div>
            <div className="w-[1px] h-8 bg-white/5"></div>
            <div className="space-y-1">
               <div className="text-xl font-mono font-extrabold text-accent">
                 {deals.length > 0 ? Math.round((deals.filter((d: any) => d.status !== 'ghosted').length / deals.length) * 100) : 0}%
               </div>
               <div className="text-[8px] font-bold text-text-muted uppercase tracking-widest">Lead Qual</div>
            </div>
         </div>
      </div>

      <AddContactModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => refreshContacts()} 
      />
    </div>
  )
}

export default Contacts
