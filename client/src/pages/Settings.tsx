import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building, Phone, Globe, Bell, Wallet, ShieldAlert, ChevronRight, 
  CheckCircle2, AlertCircle, LogOut, Wallet2, Star, Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

const SettingItem = ({ icon, label, value, onClick, color, isToggle, valueChecked }: any) => (
  <button 
    onClick={onClick}
    className="w-full bg-surface-2 p-4 rounded-2xl border border-white/5 flex items-center justify-between active:scale-[0.98] transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-2xl bg-surface flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="text-left">
        <label className="text-[10px] font-bold text-text-muted uppercase block leading-none mb-1">{label}</label>
        <span className="text-sm font-bold text-text-primary capitalize">{value}</span>
      </div>
    </div>
    {isToggle ? (
       <div className={`w-10 h-6 rounded-full p-1 transition-all ${valueChecked ? 'bg-accent' : 'bg-white/10'}`}>
          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${valueChecked ? 'translate-x-4' : 'translate-x-0'}`} />
       </div>
    ) : (
       <ChevronRight size={18} className="text-text-muted group-active:translate-x-1 transition-transform" />
    )}
  </button>
)

const Settings: React.FC = () => {
  const { user, signOut } = useStore()
  const [notifications, setNotifications] = useState({
    summary: true,
    ghosting: true,
    payments: false
  })

  const [whatsappConnected, setWhatsAppConnected] = useState(true)

  return (
    <div className="pb-24 pt-4 space-y-10">
      <h2 className="text-3xl font-syne font-extrabold mb-8 px-2">Settings</h2>

      {/* Profile Section */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-2">Profile</h3>
        <div className="space-y-3">
           <SettingItem icon={<Building size={20} />} label="Business Name" value={user?.business_name || 'My Business'} color="text-accent" />
           <SettingItem icon={<Phone size={20} />} label="WhatsApp Phone" value={user?.phone || '08012345678'} color="text-accent" />
           <SettingItem icon={<Globe size={20} />} label="Currency" value={user?.currency || 'NGN'} color="text-accent" />
        </div>
      </section>

      {/* WhatsApp Connection */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-2">Connection</h3>
        <div className={`bg-surface p-5 rounded-3xl border ${whatsappConnected ? 'border-accent/20' : 'border-hot/20'} relative overflow-hidden`}>
           <div className={`absolute top-0 right-0 py-1.5 px-4 text-[10px] font-extrabold uppercase rounded-bl-xl tracking-tight ${whatsappConnected ? 'bg-accent text-primary' : 'bg-hot text-primary'}`}>
              {whatsappConnected ? 'Connected' : 'Disconnected'}
           </div>
           <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${whatsappConnected ? 'bg-accent/10 text-accent' : 'bg-hot/10 text-hot'}`}>
                 <div className="relative">
                    <CheckCircle2 size={24} />
                    {!whatsappConnected && <div className="absolute inset-0 bg-hot rounded-full"></div>}
                 </div>
              </div>
              <div className="pt-2">
                 <h4 className="font-bold">WhatsApp Business API</h4>
                 <p className="text-xs text-text-muted">Status: {whatsappConnected ? 'Healthy' : 'Disconnected'}</p>
              </div>
           </div>
           <button 
             onClick={() => setWhatsAppConnected(!whatsappConnected)}
             className={`w-full py-4 rounded-xl text-sm font-bold transition-all ${
               whatsappConnected ? 'bg-surface-2 text-text-muted hover:text-hot active:bg-hot/5' : 'bg-accent text-primary font-extrabold'
             }`}
           >
             {whatsappConnected ? 'Disconnect Account' : 'Connect WhatsApp Now'}
           </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-2">Notifications</h3>
        <div className="space-y-2">
           <SettingItem 
             icon={<Bell size={20} />} 
             label="Morning Summary" 
             value="Daily at 8:00 AM" 
             isToggle 
             valueChecked={notifications.summary}
             onClick={() => setNotifications({...notifications, summary: !notifications.summary})}
             color="text-accent" 
           />
           <SettingItem 
             icon={<AlertCircle size={20} />} 
             label="Ghosting Alerts" 
             value="After 18 hours" 
             isToggle 
             valueChecked={notifications.ghosting}
             onClick={() => setNotifications({...notifications, ghosting: !notifications.ghosting})}
             color="text-accent" 
           />
           <SettingItem 
             icon={<Wallet2 size={20} />} 
             label="Payment Reminders" 
             value="When proof received" 
             isToggle 
             valueChecked={notifications.payments}
             onClick={() => setNotifications({...notifications, payments: !notifications.payments})}
             color="text-accent" 
           />
        </div>
      </section>

      {/* Plan & Billing */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-2">Plan & Billing</h3>
        <div className="bg-gradient-to-br from-surface to-surface-2 p-6 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden transition-all group active:scale-[0.98]">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                 <h4 className="text-2xl font-syne font-extrabold">Grind Plan</h4>
                 <div className="bg-gold text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> POPULAR
                 </div>
              </div>
              <p className="text-sm text-text-muted mb-6">Your next billing is ₦4,900 on April 12, 2024.</p>
              <div className="flex gap-4">
                 <Link to="/pricing" className="flex-1 bg-accent/10 border border-accent/20 text-accent font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                    <Zap size={16} /> Upgrade
                 </Link>
                 <button className="flex-1 bg-surface-2 text-text-muted font-bold py-3 rounded-xl text-sm border border-white/5">
                    View Billing
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 pb-10">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-2">Logout</h3>
        <div className="space-y-4">
           <button 
             onClick={() => signOut()}
             className="w-full bg-surface-2/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between group active:bg-hot/5 active:border-hot/20 transition-all font-body"
           >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center text-text-muted group-active:text-hot transition-colors">
                  <LogOut size={20} />
                </div>
                <span className="font-bold text-text-muted group-active:text-hot transition-colors font-body">Sign Out</span>
              </div>
           </button>
           <button className="w-full text-center py-4 text-xs font-bold text-hot/50 uppercase tracking-widest hover:text-hot transition-colors opacity-40">
              Delete Account
           </button>
        </div>
      </section>
    </div>
  )
}

export default Settings
