import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Star, Zap, ShieldCheck, Sparkles, Building, Briefcase, Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'

const PricingCard = ({ title, price, sub, icon, features, popular, color, border, bg }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`p-8 rounded-[40px] border relative overflow-hidden transition-all h-full flex flex-col ${border} ${bg}`}
  >
     {popular && (
       <div className="absolute top-0 right-0 py-2 px-6 bg-gold text-primary text-[10px] font-extrabold uppercase rounded-bl-3xl tracking-widest flex items-center gap-2">
          <Star size={12} fill="currentColor" /> Most Popular
       </div>
     )}
     <div className="mb-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} bg-white/5 mb-6`}>
           {icon}
        </div>
        <h3 className="text-2xl font-syne font-extrabold mb-1">{title}</h3>
        <p className="text-text-muted text-[13px] font-medium leading-relaxed">{sub}</p>
     </div>
     
     <div className="mb-10 flex items-baseline gap-1">
        <span className="text-4xl font-mono font-extrabold text-text-primary">₦{price}</span>
        {price !== '0' && <span className="text-text-muted text-sm font-bold uppercase tracking-widest">/mo</span>}
     </div>

     <div className="space-y-4 mb-12 flex-1">
        {features.map((f: string, i: number) => (
           <div key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 rounded-full ${color}`}>
                 <CheckCircle2 size={16} fill="currentColor" className="text-transparent" strokeWidth={3} />
              </div>
              <p className="text-sm font-medium text-text-primary leading-tight">{f}</p>
           </div>
        ))}
     </div>

     <button className={`w-full py-5 rounded-2xl font-extrabold text-lg transition-all active:scale-[0.98] ${
        popular ? 'bg-accent text-primary shadow-[0_15px_35px_rgba(37,211,102,0.3)]' : 'bg-surface-2 text-text-muted border border-white/10 hover:border-accent hover:text-accent'
     }`}>
        {price === '0' ? 'Get Started' : `Start with ${title}`}
     </button>
  </motion.div>
)

const Pricing: React.FC = () => {
  const plans = [
    {
       title: 'Free',
       price: '0',
       sub: 'For side hustlers starting out.',
       icon: <Briefcase size={32} />,
       color: 'text-text-muted',
       border: 'border-white/5',
       bg: 'bg-surface',
       features: [
         '1 User',
         'Up to 50 Contacts',
         'Manual Reminders',
         'Basic Pipeline View',
         'Community Support'
       ]
    },
    {
       title: 'Grind',
       price: '4,900',
       sub: 'For full-time vendors growing fast.',
       icon: <Rocket size={32} />,
       color: 'text-accent',
       border: 'border-accent/40',
       bg: 'bg-primary/20',
       popular: true,
       features: [
         'Unlimited Contacts',
         'Smart WhatsApp Connections',
         'Sabi AI Chat Extraction',
         'Automated Reminders',
         'Revenue Analytics'
       ]
    },
    {
       title: 'Sabi Pro',
       price: '19,900',
       sub: 'For teams and shops scaling big.',
       icon: <Building size={32} />,
       color: 'text-gold',
       border: 'border-gold/30',
       bg: 'bg-surface-2',
       features: [
         'Up to 5 Seats (Team Inbox)',
         'Priority Sabi Support',
         'Advanced Sales Intel',
         'Custom Webhooks',
         'Team Performance Metrics'
       ]
    }
  ]

  return (
    <div className="pb-24 pt-4 space-y-12">
      <div className="text-center space-y-4 px-4">
        <h2 className="text-4xl font-syne font-extrabold leading-[1.1]">The hustle <br /> just got <span className="text-accent underline decoration-accent/20 underline-offset-8">smarter.</span></h2>
        <p className="text-text-muted text-lg tracking-tight">Choose a plan that matches your business energy.</p>
      </div>

      <div className="space-y-6">
        {plans.map((p, i) => (
           <div key={i} className="px-2">
              <PricingCard {...p} />
           </div>
        ))}
      </div>

      <div className="bg-surface-2 p-8 rounded-[40px] border border-white/5 text-center relative overflow-hidden">
         <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl opacity-50" />
         <h3 className="text-xl font-syne font-extrabold mb-4 relative z-10">Trusted by 2,000+ Vendors</h3>
         <p className="text-sm text-text-muted mb-6 relative z-10">Sabi helps vendors across Lagos, Abuja, and Accra close 40% more deals every month.</p>
         <div className="flex justify-center gap-8 opacity-40">
            <span className="font-syne font-extrabold text-sm tracking-widest uppercase">PAGA</span>
            <span className="font-syne font-extrabold text-sm tracking-widest uppercase">FLUTTERWAVE</span>
            <span className="font-syne font-extrabold text-sm tracking-widest uppercase">PAYSTACK</span>
         </div>
      </div>

      <div className="text-center pt-10">
        <Link to="/settings" className="text-xs font-bold text-text-muted underline decoration-white/20 underline-offset-4 tracking-[0.2em] uppercase">Back to Settings</Link>
      </div>
    </div>
  )
}

export default Pricing
