import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Star, MessageCircle, Bell, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary font-body overflow-x-hidden">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-2xl font-syne font-extrabold text-accent leading-none">sabi</span>
          <span className="text-[8px] text-text-muted font-medium tracking-widest uppercase">you sabi your business</span>
        </div>
        <Link 
          to="/auth" 
          className="px-4 py-1.5 border border-accent text-accent rounded-full text-sm font-bold hover:bg-accent hover:text-primary transition-all"
        >
          Start Free
        </Link>
      </nav>

      <main className="pt-24 px-6 pb-20">
        {/* Hero Section */}
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[40px] font-syne font-extrabold leading-[1.1] mb-6"
          >
            You sabi your <span className="text-accent">customers?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-muted mb-10 leading-relaxed"
          >
            Track your WhatsApp deals, follow up on time, and never lose money in your unread messages again.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              to="/auth"
              className="group flex items-center justify-center gap-2 w-full bg-accent text-primary font-extrabold py-4 rounded-xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)]"
            >
              Start Free — No Download Needed
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-center text-text-muted text-[13px] mt-4">
              ₦0 to start. No credit card. No app store.
            </p>
          </motion.div>
        </div>

        {/* Social Proof Strip */}
        <div className="mb-16 -mx-6">
          <div className="px-6 mb-4 flex items-center gap-2">
            <span className="text-sm font-bold text-text-primary">2,400+ vendors</span>
            <span className="text-sm text-text-muted">in Lagos, Abuja & Accra</span>
          </div>
          <div className="flex gap-3 overflow-x-auto px-6 no-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center font-bold text-sm text-text-muted"
              >
                {['AO', 'ET', 'BJ', 'CK', 'MN'][i-1]}
              </div>
            ))}
          </div>
        </div>

        {/* Value Prop Cards */}
        <div className="flex flex-col gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-surface border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <MessageCircle size={80} className="text-accent" />
            </div>
            <div className="relative z-10 font-bold text-2xl mb-2">💬 Know who's waiting</div>
            <p className="text-text-muted">We track every "How much?" so nothing falls through.</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Bell size={80} className="text-accent" />
            </div>
            <div className="relative z-10 font-bold text-2xl mb-2">🔔 Follow up before it's too late</div>
            <p className="text-text-muted">Sabi reminds you before the deal goes cold.</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <ArrowUpRight size={80} className="text-accent" />
            </div>
            <div className="relative z-10 font-bold text-2xl mb-2">💰 See your money move</div>
            <p className="text-text-muted">Know exactly who owes you and who's ready to pay.</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="flex flex-col gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-surface-2 border border-white/5">
             <div className="flex text-gold mb-3">
               {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
             </div>
             <p className="italic text-text-primary mb-3">"I recovered ₦180,000 in my first week using Sabi."</p>
             <div className="text-xs text-text-muted">— Amaka O., Lagos Fashion Vendor</div>
          </div>
          <div className="p-5 rounded-2xl bg-surface-2 border border-white/5">
             <div className="flex text-gold mb-3">
               {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
             </div>
             <p className="italic text-text-primary mb-3">"My team shares one inbox now. No more confusion."</p>
             <div className="text-xs text-text-muted">— Emeka T., Abuja Logistics SME</div>
          </div>
        </div>

        {/* Pricing Teaser */}
        <div className="bg-primary/30 p-8 rounded-3xl border border-accent/20 text-center mb-16">
           <h3 className="text-2xl font-syne font-bold mb-6">Simple Pricing</h3>
           <div className="flex flex-col gap-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                 <span className="text-text-muted">Free</span>
                 <span className="font-bold">₦0</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-text-muted">Grind</span>
                 <span className="font-bold text-accent">₦4,900/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-text-muted">Sabi Pro</span>
                 <span className="font-bold text-gold">₦19,900/mo</span>
              </div>
           </div>
           <p className="text-xs text-text-muted tracking-tight">"Start free. Upgrade when your hustle grows."</p>
        </div>

        {/* Footer */}
        <footer className="text-center text-text-muted text-[11px] leading-relaxed">
           <p className="mb-2">Sabi is not affiliated with WhatsApp or Meta.</p>
           <p>© 2025 Sabi. Built for African vendors.</p>
        </footer>
      </main>
    </div>
  )
}

export default Landing
