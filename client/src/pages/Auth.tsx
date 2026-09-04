import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, Building, ChevronLeft } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { trackEvent } from '../lib/analytics'

type Step = 'email' | 'otp' | 'business'

const Auth: React.FC = () => {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { initialize, updateProfile } = useStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  React.useEffect(() => {
    trackEvent('auth_started')
  }, [])

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    if (!isSupabaseConfigured) {
      setError('Supabase credentials are not configured in Vercel. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel Project Settings > Environment Variables, then redeploy.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true }
      })
      if (authError) throw authError
      setStep('otp')
      toast('Verification code sent to your email!', 'success')
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return
    setLoading(true)
    setError(null)
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email'
      })
      if (verifyError || !data.session) throw verifyError || new Error('Verification failed')
      useStore.setState({ token: data.session.access_token })
      await initialize()
      const profile = useStore.getState().user
      if (!profile?.business_name) {
        setStep('business')
      } else {
        trackEvent('auth_completed', { is_returning: true })
        toast('Welcome back to Sabi! 👋', 'success')
        navigate('/today')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired 6-digit code.')
    } finally {
      setLoading(false)
    }
  }

  const handleSetBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessName.trim()) return
    setLoading(true)
    setError(null)
    try {
      await updateProfile({ business_name: businessName.trim() })
      trackEvent('auth_completed', { is_returning: false, business_name: businessName.trim() })
      toast('Welcome to Sabi! 🚀', 'success')
      navigate('/today')
    } catch (err: any) {
      setError(err.message || 'Profile setup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-success/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand */}
      <div className="mt-10 mb-10 relative">
        <div className="flex items-center gap-3 mb-6 bg-surface w-fit px-4 py-2.5 rounded-2xl border border-surface-border">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center font-black text-background">
            S
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-text-primary font-display">Sabi</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div key="email-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h1 className="text-3xl font-extrabold text-text-primary leading-tight mb-2 font-display">
                Never lose a sale<br />to a cold chat 💚
              </h1>
              <p className="text-text-muted text-sm font-body">
                Enter your email to sign in or create an account.
              </p>
            </motion.div>
          )}
          {step === 'otp' && (
            <motion.div key="otp-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h1 className="text-3xl font-extrabold text-text-primary leading-tight mb-2 font-display">
                Check your inbox 🔐
              </h1>
              <p className="text-text-muted text-sm">
                We sent a 6-digit code to <span className="text-text-primary font-semibold">{email}</span>
              </p>
            </motion.div>
          )}
          {step === 'business' && (
            <motion.div key="biz-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h1 className="text-3xl font-extrabold text-text-primary leading-tight mb-2 font-display">
                Name your business 🏪
              </h1>
              <p className="text-text-muted text-sm">What is your brand or store name?</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Forms */}
      <div className="flex-1 max-w-sm w-full mx-auto">
        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.form key="email-form" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
              onSubmit={handleSendMagicLink} className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input required type="email" placeholder="vendor@sabi.app" autoFocus
                    className="w-full bg-surface rounded-2xl border border-surface-border py-4 pl-11 pr-4 text-text-primary placeholder:text-text-muted/50 outline-none focus:border-accent/50 transition-all text-base font-body"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {error && <p className="text-danger text-xs font-medium text-center bg-danger/10 p-3 rounded-xl border border-danger/20">{error}</p>}
              <button type="submit" disabled={loading || !email.trim()}
                className="w-full bg-accent text-background font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,176,32,0.2)]"
              >
                {loading ? <div className="w-6 h-6 border-3 border-background border-t-transparent rounded-full animate-spin" />
                  : <><span>Send Login Code</span><ArrowRight size={20} /></>}
              </button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.div key="otp-form" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
              <div>
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1 mb-2 block">6-digit code</label>
                <input type="text" maxLength={6} inputMode="numeric" placeholder="123456" autoFocus
                  className="w-full bg-surface rounded-2xl border border-surface-border py-4 text-center text-2xl font-mono font-bold text-accent outline-none focus:border-accent transition-all"
                  value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {error && <p className="text-danger text-xs font-medium text-center bg-danger/10 p-3 rounded-xl border border-danger/20">{error}</p>}
              <button onClick={handleVerifyOtp} disabled={otp.length < 6 || loading}
                className="w-full bg-accent text-background font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,176,32,0.2)]"
              >
                {loading ? <div className="w-6 h-6 border-3 border-background border-t-transparent rounded-full animate-spin" />
                  : <><span>Verify & Sign In</span><CheckCircle2 size={20} /></>}
              </button>
              <div className="flex flex-col items-center gap-2 pt-2">
                <button onClick={() => { setStep('email'); setOtp(''); setError(null) }}
                  className="text-xs font-medium text-text-muted hover:text-text-primary flex items-center gap-1"
                ><ChevronLeft size={14} /> Back to Email</button>
              </div>
            </motion.div>
          )}

          {step === 'business' && (
            <motion.form key="business-form" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              onSubmit={handleSetBusiness} className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Business Name</label>
                <div className="relative">
                  <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input required type="text" placeholder="e.g. Chidinma Couture" autoFocus
                    className="w-full bg-surface rounded-2xl border border-surface-border py-4 pl-11 pr-4 text-text-primary placeholder:text-text-muted/50 outline-none focus:border-accent/50 transition-all text-base font-body"
                    value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              </div>
              {error && <p className="text-danger text-xs font-medium text-center bg-danger/10 p-3 rounded-xl border border-danger/20">{error}</p>}
              <button type="submit" disabled={loading || !businessName.trim()}
                className="w-full bg-success text-background font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {loading ? <div className="w-6 h-6 border-3 border-background border-t-transparent rounded-full animate-spin" />
                  : <><span>Complete Setup</span><ArrowRight size={20} /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-4 text-center">
        <p className="text-[10px] text-text-muted/60 uppercase tracking-widest font-medium">Sabi Revenue Memory • v1.0</p>
      </div>
    </div>
  )
}

export default Auth
