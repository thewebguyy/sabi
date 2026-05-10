import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, Phone, CheckCircle2, AlertCircle, LogOut, Gift, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import axios from 'axios'

const FOLLOW_UP_OPTIONS = [
  { label: '24h', value: 24 },
  { label: '48h', value: 48 },
  { label: '72h', value: 72 },
]

const Settings: React.FC = () => {
  const { user, signOut, updateUser } = useStore()
  const navigate = useNavigate()
  const [businessName, setBusinessName] = useState(user?.business_name || '')
  const [savingName, setSavingName] = useState(false)
  const [referralStats, setReferralStats] = useState<any>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  React.useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const res = await axios.get(`${apiUrl}/api/referral/stats`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
        setReferralStats(res.data)
      } catch (err) {
        console.error('Failed to fetch referrals', err)
      }
    }
    fetchReferrals()
  }, [])

  const handleNameBlur = async () => {
    if (!businessName.trim() || businessName === user?.business_name) return
    setSavingName(true)
    await updateUser({ business_name: businessName.trim() })
    setSavingName(false)
  }

  const handleFollowUpChange = async (hours: number) => {
    await updateUser({ follow_up_hours: hours })
  }

  const followUpHours = user?.follow_up_hours ?? 48
  const isConnected = user?.whatsapp_connected ?? false

  return (
    <div className="pb-24 space-y-8">

      {/* Profile */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Profile</h3>

        <div className="bg-surface rounded-3xl border border-white/5 p-5 space-y-5">
          {/* Business Name — editable */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
              <Building size={12} />
              Business Name
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-surface-2 rounded-2xl border border-white/5 py-4 px-4 text-text-primary outline-none focus:border-accent/40 transition-all font-body text-sm"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="Your business name"
              />
              {savingName && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">Saving…</span>
              )}
            </div>
          </div>

          {/* WhatsApp Phone — display only */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
              <Phone size={12} />
              WhatsApp Number
            </label>
            <div className="bg-surface-2 rounded-2xl border border-white/5 py-4 px-4 text-text-primary font-mono text-sm">
              {user?.phone || '—'}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Connection Status */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">WhatsApp Connection</h3>
        <div className={`bg-surface rounded-3xl border p-5 flex items-center gap-4 ${isConnected ? 'border-accent/20' : 'border-hot/20'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isConnected ? 'bg-accent/10 text-accent' : 'bg-hot/10 text-hot'}`}>
            {isConnected ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{isConnected ? 'Connected' : 'Not Connected'}</p>
            <p className="text-xs text-text-muted mt-0.5">
              {isConnected
                ? 'WhatsApp Business API is active'
                : 'Connect via Meta to auto-sync'
              }
            </p>
          </div>
          {!isConnected ? (
            <button onClick={() => navigate('/connect')} className="px-4 py-2 rounded-xl text-xs font-extrabold bg-accent text-primary transition-transform active:scale-95">
              Connect
            </button>
          ) : (
            <div className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-accent text-primary">
              Active
            </div>
          )}
        </div>
      </section>

      {/* Follow-up Timing */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Follow-up Timing</h3>
        <p className="text-xs text-text-muted px-1">Get notified when a deal hasn't had contact in this long.</p>
        <div className="bg-surface-2 p-1.5 rounded-2xl flex gap-1">
          {FOLLOW_UP_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleFollowUpChange(opt.value)}
              className={`flex-1 py-3 rounded-xl text-sm font-extrabold transition-all ${
                followUpHours === opt.value
                  ? 'bg-accent text-primary shadow-[0_4px_15px_rgba(37,211,102,0.3)]'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Refer & Earn */}
      {referralStats && (
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Refer & Earn</h3>
          <div className="bg-gradient-to-br from-accent/20 to-surface rounded-3xl border border-accent/20 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent text-primary flex items-center justify-center">
                <Gift size={20} />
              </div>
              <div>
                <p className="font-extrabold text-sm text-text-primary">Get 1 Month Free</p>
                <p className="text-xs text-text-muted mt-0.5">For every active friend you invite</p>
              </div>
            </div>
            
            <div className="bg-surface-2 rounded-2xl border border-white/5 p-3 flex justify-between items-center gap-3">
              <div className="text-xs font-mono truncate text-text-muted flex-1 pl-1">
                {referralStats.referral_link}
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(referralStats.referral_link)
                  setCopiedLink(true)
                  setTimeout(() => setCopiedLink(false), 2000)
                }}
                className="w-8 h-8 rounded-xl bg-accent text-primary flex items-center justify-center flex-shrink-0 active:scale-95 transition-all"
              >
                {copiedLink ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Pending</p>
                <p className="text-lg font-mono font-extrabold">{referralStats.pending_referrals}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Earned</p>
                <p className="text-lg font-mono font-extrabold text-accent">{referralStats.earned_months} mos</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sign Out */}
      <section className="pt-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => signOut()}
          className="w-full bg-surface-2 border border-white/5 py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold text-hot/60 hover:text-hot hover:border-hot/20 active:bg-hot/5 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </section>
    </div>
  )
}

export default Settings
