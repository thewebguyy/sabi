import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, MoreHorizontal, MessageSquare, Clock, CheckCircle2, 
  Send, Copy, Flame, ShieldCheck, Share2, Upload, X 
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { getWhatsAppLink } from '../lib/utils'
import { useDeal, Message } from '../hooks/useDeal'
import { supabase } from '../lib/supabase'

const DealDetail: React.FC = () => {
  const { id } = useParams()
  const { deal, messages, loading, error } = useDeal(id)
  const [status, setStatus] = useState('pending')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)

  useEffect(() => {
    if (deal) setStatus(deal.status)
  }, [deal])

  const handleMarkPaid = () => {
    setShowPaymentModal(true)
  }

  const confirmPayment = async () => {
    setLoadingPayment(true)
    try {
      // Real update in Supabase
      const { error } = await supabase
        .from('deals')
        .update({ status: 'paid' })
        .eq('id', id);
      
      if (error) throw error;

      setTimeout(() => {
        setLoadingPayment(false)
        setShowPaymentModal(false)
        setStatus('paid')
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#25D366', '#0A3828', '#FF6B35']
        })
      }, 1000)
    } catch (err) {
      console.error(err);
      setLoadingPayment(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-accent">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="p-10 text-center space-y-4 bg-background min-h-screen">
        <h2 className="text-xl font-bold">Deal not found</h2>
        <Link to="/pipeline" className="text-accent underline">Go back to pipeline</Link>
      </div>
    )
  }

  return (
    <div className="pb-32 pt-2 min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-1">
        <Link to="/pipeline" className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary">
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
           <h2 className="text-lg font-bold leading-none">{deal.contacts?.name || 'Unknown'}</h2>
           <p className="text-[10px] font-mono text-text-muted mt-1">{deal.contacts?.phone}</p>
        </div>
        <button className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex justify-center">
            <div className={`px-4 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 ${
                status === 'paid' ? 'bg-success/10 border-success text-success' : 'bg-hot/10 border-hot text-hot'
            }`}>
              {status === 'paid' ? <CheckCircle2 size={12} fill="currentColor" className="text-transparent" /> : <Flame size={12} fill="currentColor" />}
              {status === 'paid' ? 'Paid & Verified' : 'Waiting for Payment'}
            </div>
        </div>

        {/* Deal Card */}
        <div className="bg-surface p-6 rounded-[32px] border border-white/5 space-y-6 shadow-2xl">
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Item / Deal Title</label>
              <h3 className="text-xl font-syne font-extrabold">{deal.title}</h3>
           </div>

           <div className="flex justify-between items-center bg-surface-2/50 p-4 rounded-2xl border border-white/5">
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-text-muted uppercase opacity-50">Amount</label>
                 <div className="text-2xl font-mono font-extrabold text-accent">₦{deal.amount?.toLocaleString()}</div>
              </div>
              <div className="text-right space-y-1">
                 <label className="text-[10px] font-bold text-text-muted uppercase opacity-50">Constraint</label>
                 <div className="text-xs font-bold text-hot">{deal.customer_constraint || 'None'}</div>
              </div>
           </div>
        </div>

        {/* Sabi AI Box */}
        <div className="bg-primary/20 p-6 rounded-[32px] border border-accent/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={100} className="text-accent" />
           </div>
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={20} className="text-accent" />
                 <span className="text-sm font-syne font-extrabold text-accent uppercase tracking-widest">Sabi knows this deal</span>
              </div>
              <p className="text-sm italic leading-relaxed text-text-primary/90">"{deal.summary}"</p>
              
              <div className="space-y-3 pt-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Suggested Reply</label>
                    <button 
                       onClick={() => handleCopy(deal.ai_suggested_reply)}
                       className="text-xs font-bold text-accent flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                       <Copy size={12} /> Copy Reply
                    </button>
                 </div>
                 <div className="bg-primary/40 p-4 rounded-2xl border border-accent/10 text-xs leading-relaxed">
                    {deal.ai_suggested_reply}
                 </div>
              </div>
           </div>
        </div>

        {/* Chat History Header */}
        <div className="flex items-center gap-2 px-2 pt-4">
           <MessageSquare size={16} className="text-text-muted" />
           <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Chat History</span>
        </div>

        {/* Real Chat bubbles */}
        <div className="space-y-4 px-2">
           {messages.length > 0 ? messages.map((m: Message) => (
             <div key={m.id} className={`flex flex-col ${m.direction === 'outbound' ? 'items-end ml-auto' : 'items-start'} max-w-[85%]`}>
                <div className={`p-3 rounded-2xl ${
                  m.direction === 'outbound' 
                    ? 'bg-accent/80 rounded-tr-none text-primary font-medium shadow-lg' 
                    : 'bg-surface-2 rounded-tl-none text-text-primary border border-white/5'
                } text-sm`}>
                   {m.body}
                </div>
                <span className={`text-[8px] font-mono text-text-muted mt-1 px-1 ${m.direction === 'outbound' ? 'text-right' : ''}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
             </div>
           )) : (
             <p className="text-center text-xs text-text-muted py-10 opacity-50">No chat history found for this deal.</p>
           )}
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-white/5 p-4 safe-p-bottom z-40">
           <div className="flex gap-3">
              <button 
                onClick={handleMarkPaid}
                disabled={status === 'paid'}
                className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                   status === 'paid' ? 'bg-success/10 text-success opacity-50' : 'bg-surface-2 text-text-muted hover:text-text-primary border border-white/5'
                }`}
              >
                 <CheckCircle2 size={24} />
                 <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Paid</span>
              </button>
              <button className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-2 text-text-muted hover:text-text-primary border border-white/5 transition-all">
                 <Clock size={24} />
                 <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Remind</span>
              </button>
              <a 
                href={getWhatsAppLink(deal.contacts?.phone || '', deal.ai_suggested_reply)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-[3] bg-accent text-primary font-extrabold rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_10px_30px_rgba(37,211,102,0.3)] h-16"
              >
                 Message on WhatsApp
                 <Send size={24} />
              </a>
           </div>
        </div>
      </div>

      {/* Payment Proof Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-background/90"
               onClick={() => setShowPaymentModal(false)}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative bg-surface w-full max-w-md rounded-[40px] border border-white/10 p-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
             >
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-6 right-6 text-text-muted hover:text-text-primary"
                >
                   <X size={24} />
                </button>
                
                <div className="text-center mb-10 pt-4">
                   <div className="w-16 h-16 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck size={32} />
                   </div>
                   <h3 className="text-2xl font-syne font-extrabold mb-2">Verify Payment</h3>
                   <p className="text-sm text-text-muted px-6">Upload {deal.contacts?.name}'s payment proof to mark this deal as paid.</p>
                </div>

                <div className="space-y-6 mb-10">
                   <div className="bg-surface-2 border border-white/5 p-4 rounded-2xl flex justify-between items-center font-mono">
                      <span className="text-xs text-text-muted uppercase">Amount</span>
                      <span className="text-xl font-extrabold text-accent">₦{deal.amount?.toLocaleString()}</span>
                   </div>
                   
                   <div className="aspect-video bg-surface-2 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 group hover:border-accent/40 cursor-pointer transition-all">
                      <Upload size={32} className="text-text-muted group-hover:text-accent transition-colors" />
                      <span className="text-xs font-bold text-text-muted group-hover:text-text-primary transition-colors uppercase tracking-[0.2em]">Upload Screenshot</span>
                   </div>
                </div>

                <button 
                   onClick={confirmPayment}
                   disabled={loadingPayment}
                   className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,211,102,0.3)] disabled:opacity-50"
                >
                   {loadingPayment ? <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> : (
                      <>
                        Confirm Payment
                        <CheckCircle2 size={24} />
                      </>
                   )}
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DealDetail
