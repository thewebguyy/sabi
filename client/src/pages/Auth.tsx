import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, Building, X, ChevronLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useToast } from '../context/ToastContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

type Step = 'phone' | 'otp' | 'business'

const Auth: React.FC = () => {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)
  const [isNewUser, setIsNewUser] = useState(false)
  
  const { authenticateWithPhone } = useStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  const startResendTimer = () => {
    setResendTimer(59)
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0 }
        return t - 1
      })
    }, 1000)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const res = await axios.post(`${apiUrl}/api/auth/send-otp`, { phone })
      setIsNewUser(res.data.isNewUser ?? false)
      setStep('otp')
      startResendTimer()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP. Check number and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return
    setLoading(true)
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const res = await axios.post(`${apiUrl}/api/auth/verify-otp`, { phone, otp })
      
      if (res.data.isNewUser) {
        setStep('business')
      } else {
        // Existing user — log them in directly
        await authenticateWithPhone(phone, otp, res.data.token)
        toast('Welcome back! 👋', 'success')
        navigate('/deals')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired code.')
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
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const res = await axios.post(`${apiUrl}/api/auth/setup-profile`, { phone, businessName })
      await authenticateWithPhone(phone, otp, res.data.token)
      toast('Welcome to Sabi CRM! 🎉', 'success')
      navigate('/deals')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Setup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      await axios.post(`${apiUrl}/api/auth/send-otp`, { phone })
      startResendTimer()
      toast('New code sent!', 'success')
    } catch {
      toast('Failed to resend. Try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 overflow-hidden relative">
      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="mt-10 mb-12 relative">
        <div className="flex items-center gap-3 mb-8 bg-surface-2 w-fit px-4 py-2.5 rounded-2xl border border-white/5">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
            <ShieldCheck size={16} className="text-primary" />
          </div>
          <span className="text-base font-extrabold uppercase tracking-tighter text-text-primary">Sabi CRM</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div key="phone-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h1 className="text-4xl font-extrabold text-text-primary leading-[1.1] mb-3">
                Your business,<br />your CRM. 💚
              </h1>
              <p className="text-text-muted text-base leading-relaxed">
                Enter your WhatsApp number to get started.
              </p>
            </motion.div>
          )}
          {step === 'otp' && (
            <motion.div key="otp-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h1 className="text-4xl font-extrabold text-text-primary leading-[1.1] mb-3">
                Check your<br />WhatsApp 🔐
              </h1>
              <p className="text-text-muted text-base leading-relaxed">
                We sent a 6-digit code to <span className="text-text-primary font-bold">{phone}</span>
              </p>
            </motion.div>
          )}
          {step === 'business' && (
            <motion.div key="biz-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h1 className="text-4xl font-extrabold text-text-primary leading-[1.1] mb-3">
                Name your<br />business 🏪
              </h1>
              <p className="text-text-muted text-base leading-relaxed">
                This appears on your Sabi dashboard.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Forms */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.form
              key="phone-form"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">
                  WhatsApp Number
                </label>
                <div className="relative group">
                  <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    required
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className="w-full bg-surface-2 rounded-2xl border border-white/5 py-5 pl-12 pr-4 text-text-primary outline-none focus:border-accent/40 transition-all font-body text-base"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {error && <p className="text-hot text-xs font-bold text-center bg-hot/10 p-3 rounded-xl border border-hot/20">{error}</p>}

              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,211,102,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading
                  ? <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  : <><span>Send Code</span><ArrowRight size={22} /></>
                }
              </button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp-form"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1 mb-3 block">
                  6-digit code
                </label>
                <div className="flex justify-between gap-2">
                  {[0,1,2,3,4,5].map((i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="tel"
                      maxLength={1}
                      inputMode="numeric"
                      className="w-full aspect-square bg-surface-2 rounded-2xl border-2 border-white/5 text-center text-2xl font-mono font-extrabold text-accent outline-none focus:border-accent transition-all"
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/, '').substring(0, 1)
                        const arr = otp.split('')
                        arr[i] = val
                        const next = arr.join('')
                        setOtp(next)
                        if (val) {
                          const nextEl = document.getElementById(`otp-${i + 1}`)
                          if (nextEl) (nextEl as HTMLInputElement).focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i]) {
                          const prev = document.getElementById(`otp-${i - 1}`)
                          if (prev) (prev as HTMLInputElement).focus()
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-hot text-xs font-bold text-center bg-hot/10 p-3 rounded-xl border border-hot/20">{error}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={otp.length < 6 || loading}
                className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,211,102,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading
                  ? <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  : <><span>Verify Code</span><CheckCircle2 size={22} /></>
                }
              </button>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="text-sm font-bold text-text-muted disabled:opacity-40 transition-colors hover:text-text-primary"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
                <button
                  onClick={() => { setStep('phone'); setOtp(''); setError(null) }}
                  className="text-xs font-bold text-hot/60 uppercase tracking-[0.2em] flex items-center gap-1.5"
                >
                  <ChevronLeft size={14} /> Change Number
                </button>
              </div>
            </motion.div>
          )}

          {step === 'business' && (
            <motion.form
              key="business-form"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onSubmit={handleSetBusiness}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">
                  Business Name
                </label>
                <div className="relative group">
                  <Building size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Chidinma Fashion House"
                    className="w-full bg-surface-2 rounded-2xl border border-white/5 py-5 pl-12 pr-4 text-text-primary outline-none focus:border-accent/40 transition-all font-body text-base"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {error && <p className="text-hot text-xs font-bold text-center bg-hot/10 p-3 rounded-xl border border-hot/20">{error}</p>}

              <button
                type="submit"
                disabled={loading || !businessName.trim()}
                className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,211,102,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading
                  ? <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  : <><span>Let's Go 🚀</span><ArrowRight size={22} /></>
                }
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-6 text-center">
        <p className="text-[10px] text-text-muted/40 uppercase tracking-[0.3em] font-bold">Built for Naija vendors 🇳🇬</p>
      </div>
    </div>
  )
}

export default Auth
