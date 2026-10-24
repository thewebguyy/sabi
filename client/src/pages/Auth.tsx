import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2, Building, ChevronLeft, Lock, MessageCircle, Sun, Moon } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link } from 'react-router-dom'
import { trackEvent } from '../lib/analytics'

type AuthMethod = 'phone' | 'email'
type Step = 'input' | 'otp' | 'business'

const Auth: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone')
  const [step, setStep] = useState<Step>('input')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { theme, toggleTheme } = useTheme()
  const { initialize, updateProfile } = useStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  React.useEffect(() => {
    trackEvent('auth_started', { default_method: 'phone' })
  }, [])

  // Standardize Nigerian phone format: converts 080... or 80... to +23480...
  const formatNigerianPhone = (raw: string): string => {
    const cleaned = raw.replace(/\D/g, '')
    if (cleaned.startsWith('234')) {
      return `+${cleaned}`
    }
    if (cleaned.startsWith('0')) {
      return `+234${cleaned.slice(1)}`
    }
    if (cleaned.length === 10) {
      return `+234${cleaned}`
    }
    return `+${cleaned}`
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSupabaseConfigured) {
      setError('Database connection is not configured in environment variables. Please check Vercel settings.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (authMethod === 'phone') {
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length < 10) {
          throw new Error('Please enter a valid 11-digit Nigerian WhatsApp phone number (e.g. 08012345678).')
        }
        const formattedPhone = formatNigerianPhone(phone)
        const { error: authError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: {
            channel: 'whatsapp',
            shouldCreateUser: true,
          },
        })
        if (authError) throw authError
        setStep('otp')
        toast('6-digit code sent to your WhatsApp! 💚', 'success')
      } else {
        if (!email.trim()) return
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: { shouldCreateUser: true },
        })
        if (authError) throw authError
        setStep('otp')
        toast('Verification code sent to your email!', 'success')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return
    setLoading(true)
    setError(null)
    try {
      let result
      if (authMethod === 'phone') {
        const formattedPhone = formatNigerianPhone(phone)
        result = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otp.trim(),
          type: 'sms',
        })
      } else {
        result = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: otp.trim(),
          type: 'email',
        })
      }

      const { data, error: verifyError } = result
      if (verifyError || !data.session) throw verifyError || new Error('Verification failed')

      useStore.setState({ token: data.session.access_token })
      await initialize()

      const profile = useStore.getState().user
      if (!profile?.business_name) {
        setStep('business')
      } else {
        trackEvent('auth_completed', { is_returning: true, method: authMethod })
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
      trackEvent('auth_completed', { is_returning: false, business_name: businessName.trim(), method: authMethod })
      toast('Welcome to Sabi! 🚀', 'success')
      navigate('/today')
    } catch (err: any) {
      setError(err.message || 'Profile setup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between p-6 relative overflow-hidden transition-colors duration-200">
      {/* Background ambient accents */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-accent-whatsapp/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Brand Nav */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <Link to="/" className="flex items-center gap-2.5 bg-surface px-3.5 py-2 rounded-2xl border border-surface-border shadow-sm">
          <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center font-black text-white dark:text-background text-xs">
            S
          </div>
          <span className="text-sm font-bold tracking-tight text-text-primary font-display">sabi</span>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Warm Light'} mode`}
          className="p-2 rounded-xl bg-surface border border-surface-border text-text-muted hover:text-text-primary transition-all"
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} className="text-accent" />}
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="mb-7">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div key="input-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-whatsapp/10 border border-accent-whatsapp/30 text-accent-whatsapp text-[11px] font-mono font-bold mb-3">
                  <ShieldCheck size={13} />
                  <span>Zero-Ban WhatsApp Utility</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-[1.12] mb-2 font-display">
                  Never lose a sale<br />to a cold chat 💚
                </h1>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                  {authMethod === 'phone'
                    ? 'Enter your WhatsApp phone number to receive your instant login code.'
                    : 'Enter your business email address to sign in or get started.'}
                </p>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-[11px] font-mono font-bold mb-3">
                  <Lock size={13} />
                  <span>Instant Verification</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-[1.12] mb-2 font-display">
                  Enter your 6-digit code 🔐
                </h1>
                <p className="text-text-muted text-sm leading-relaxed">
                  We sent a code to{' '}
                  <span className="text-text-primary font-bold">
                    {authMethod === 'phone' ? phone : email}
                  </span>{' '}
                  via {authMethod === 'phone' ? 'WhatsApp' : 'email'}.
                </p>
              </motion.div>
            )}

            {step === 'business' && (
              <motion.div key="biz-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 border border-success/30 text-success text-[11px] font-mono font-bold mb-3">
                  <Building size={13} />
                  <span>Store Setup</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-[1.12] mb-2 font-display">
                  Name your business 🏪
                </h1>
                <p className="text-text-muted text-sm">
                  What brand or shop name do your WhatsApp customers know you by?
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Forms */}
        <div className="bg-surface rounded-3xl border border-surface-border p-6 sm:p-8 shadow-xl">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.form
                key="input-form"
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 16, opacity: 0 }}
                onSubmit={handleSendCode}
                className="space-y-5"
              >
                {authMethod === 'phone' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">
                        WhatsApp Phone Number
                      </label>
                      <span className="text-[11px] font-mono text-accent-whatsapp font-bold">
                        🇳🇬 Nigeria (+234)
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-text-muted font-bold text-sm">
                        <MessageCircle size={18} className="text-accent-whatsapp" />
                        <span className="font-mono text-text-primary">+234</span>
                        <span className="text-surface-border">|</span>
                      </div>
                      <input
                        required
                        type="tel"
                        inputMode="numeric"
                        placeholder="0801 234 5678"
                        autoFocus
                        className="w-full bg-surface-2 rounded-2xl border border-surface-border py-4 pl-24 pr-4 text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent transition-all text-base font-mono font-medium shadow-sm"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <p className="text-[11px] text-text-muted ml-1">
                      We'll send your secure one-time login code straight to your WhatsApp.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        required
                        type="email"
                        placeholder="vendor@sabi.app"
                        autoFocus
                        className="w-full bg-surface-2 rounded-2xl border border-surface-border py-4 pl-11 pr-4 text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent transition-all text-base font-body shadow-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-danger text-xs font-medium text-center bg-danger/10 p-3 rounded-xl border border-danger/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || (authMethod === 'phone' ? phone.length < 9 : !email.trim())}
                  className="w-full bg-accent text-white dark:text-background font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_4px_25px_rgba(217,119,6,0.25)] hover:opacity-95"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{authMethod === 'phone' ? 'Get Started via WhatsApp' : 'Send My Code'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* Primary/Secondary Auth Method Toggle */}
                <div className="pt-2 text-center">
                  {authMethod === 'phone' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('email')
                        setError(null)
                      }}
                      className="text-xs text-text-muted hover:text-text-primary font-medium transition-colors"
                    >
                      Prefer email? <span className="underline text-accent">Sign in with email address</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('phone')
                        setError(null)
                      }}
                      className="text-xs text-text-muted hover:text-text-primary font-medium transition-colors"
                    >
                      Use phone? <span className="underline text-accent">Sign in with WhatsApp number</span>
                    </button>
                  )}
                </div>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp-form"
                initial={{ x: 16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -16, opacity: 0 }}
                className="space-y-5"
              >
                <div>
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1 mb-2 block">
                    Enter 6-digit code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="123456"
                    autoFocus
                    className="w-full bg-surface-2 rounded-2xl border border-surface-border py-4 text-center text-2xl font-mono font-extrabold text-accent outline-none focus:border-accent transition-all tracking-[0.25em]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                {error && (
                  <p className="text-danger text-xs font-medium text-center bg-danger/10 p-3 rounded-xl border border-danger/20">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 6 || loading}
                  className="w-full bg-accent text-white dark:text-background font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_4px_25px_rgba(217,119,6,0.25)] hover:opacity-95"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>

                <div className="flex flex-col items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setStep('input')
                      setOtp('')
                      setError(null)
                    }}
                    className="text-xs font-medium text-text-muted hover:text-text-primary flex items-center gap-1"
                  >
                    <ChevronLeft size={14} /> Back to {authMethod === 'phone' ? 'Phone Number' : 'Email'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'business' && (
              <motion.form
                key="business-form"
                initial={{ x: 16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -16, opacity: 0 }}
                onSubmit={handleSetBusiness}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">
                    Store or Business Name
                  </label>
                  <div className="relative">
                    <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Chidinma Lace Hub, Tunde Gadgets"
                      autoFocus
                      className="w-full bg-surface-2 rounded-2xl border border-surface-border py-4 pl-11 pr-4 text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent transition-all text-base font-body shadow-sm"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-danger text-xs font-medium text-center bg-danger/10 p-3 rounded-xl border border-danger/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !businessName.trim()}
                  className="w-full bg-success text-white font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_4px_25px_rgba(5,150,105,0.25)] hover:opacity-95"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Open My Sabi Dashboard</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Subtle Trust Signals */}
          <div className="pt-6 mt-6 border-t border-surface-border flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              <span className="w-7 h-7 rounded-full bg-accent/20 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-accent">
                AO
              </span>
              <span className="w-7 h-7 rounded-full bg-accent-whatsapp/20 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-accent-whatsapp">
                TB
              </span>
              <span className="w-7 h-7 rounded-full bg-gold/20 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-gold">
                BE
              </span>
            </div>
            <p className="text-[11px] text-text-muted font-medium">
              Join <span className="text-text-primary font-bold">1,000+ Nigerian vendors</span> tracking millions in recovered sales.
            </p>
          </div>
        </div>
      </div>

      {/* Humanized Merchant Trust Footer */}
      <div className="pb-2 text-center text-xs text-text-muted flex items-center justify-center gap-2">
        <Lock size={12} className="text-accent-whatsapp shrink-0" />
        <span>Securing sales for merchants across Lagos, Abuja, Port Harcourt & Aba</span>
      </div>
    </div>
  )
}

export default Auth
