import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, ShoppingBag, DollarSign, StickyNote, Bell, Sparkles, ChevronDown } from 'lucide-react'

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddDealModal: React.FC<AddDealModalProps> = ({ isOpen, onClose }) => {
  const [extracting, setExtracting] = useState(false)
  
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
                  />
                  <button 
                    onClick={() => {
                        setExtracting(true)
                        setTimeout(() => setExtracting(false), 2000)
                    }}
                    className="w-full py-3 bg-accent/10 text-accent font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-accent/20 transition-all"
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
               <form className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Contact Name / Phone</label>
                     <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                        <input 
                           type="text" 
                           placeholder="e.g. Chidinma O."
                           className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-accent/40 transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">What are they buying?</label>
                     <div className="relative group">
                        <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                        <input 
                           type="text" 
                           placeholder="e.g. Ankara Fabric (6 yards)"
                           className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-text-primary outline-none focus:border-accent/40 transition-all"
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
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Status</label>
                        <div className="relative group">
                           <select 
                              className="w-full bg-surface-2 border border-white/5 rounded-2xl py-4 pl-4 pr-10 text-sm text-text-primary outline-none focus:border-accent/40 transition-all appearance-none cursor-pointer"
                           >
                              <option>New Inquiry</option>
                              <option>Conversation</option>
                              <option>Waiting Payment</option>
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
                           className="w-full h-24 bg-surface-2 border border-white/5 rounded-2xl p-4 pl-12 text-sm text-text-primary outline-none focus:border-accent/40 transition-all resize-none"
                        />
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-2 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                           <Bell size={18} />
                        </div>
                        <span className="text-sm font-bold text-text-primary">Set Reminder</span>
                     </div>
                     <div className="w-10 h-6 bg-accent rounded-full p-1">
                        <div className="w-4 h-4 bg-white rounded-full translate-x-4"></div>
                     </div>
                  </div>

                  <button 
                     type="button" 
                     onClick={onClose}
                     className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg shadow-[0_15px_30px_rgba(37,211,102,0.3)] active:scale-95 transition-all"
                  >
                     Save Deal
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
