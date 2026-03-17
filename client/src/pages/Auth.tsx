import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2, Building, Eye, EyeOff, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import axios from 'axios'

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState<'auth' | 'otp'>('auth')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { signIn, signUp } = useStore()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, { phone });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, { phone });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      if (otp === '123456') { // Demo code
        const fakeEmail = `${phone.replace(/\+/g, '')}@sabi.app`;
        if (isLogin) {
          await signIn(fakeEmail, password);
        } else {
          await signUp(fakeEmail, password, businessName);
        }
      } else {
        throw new Error('Invalid OTP code. Try 123456 for demo.');
      }
    } catch (err: any) {
      setError(err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 font-syne overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="mt-12 mb-16 relative">
        <div className="flex items-center gap-3 mb-6 bg-surface-2 w-fit px-4 py-2 rounded-2xl border border-white/5">
          <ShieldCheck size={24} className="text-accent" />
          <span className="text-lg font-extrabold uppercase tracking-tighter">Sabi CRM</span>
        </div>
        <h1 className="text-4xl font-extrabold text-text-primary leading-[1.1] mb-4">
          {step === 'auth' ? (isLogin ? 'Welcome back, Oga! 👋' : 'Build your Business Empire 🚀') : 'Verify e dey your hand 🔐'}
        </h1>
        <p className="text-text-muted text-lg max-w-[85%] leading-relaxed">
          {step === 'auth' ? 'The WhatsApp CRM that actually helps you collect your money.' : `We just sent a 6-digit code to ${phone}.`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'auth' ? (
          <motion.div 
            key="auth-form"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Business Name</label>
                  <div className="relative group">
                    <Building size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Chidinma Fashion Home"
                      className="w-full bg-surface-2 rounded-2xl border border-white/5 py-5 pl-12 pr-4 text-text-primary outline-none focus:border-accent/40 transition-all font-body"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 text-text-primary">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">WhatsApp Phone Number</label>
                <div className="relative group">
                  <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input 
                    required
                    type="tel" 
                    placeholder="+234 800 000 0000"
                    className="w-full bg-surface-2 rounded-2xl border border-white/5 py-5 pl-12 pr-4 text-text-primary outline-none focus:border-accent/40 transition-all font-body"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-2">Password</label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input 
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-surface-2 rounded-2xl border border-white/5 py-5 pl-12 pr-12 text-text-primary outline-none focus:border-accent/40 transition-all font-body"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-hot text-xs font-bold text-center bg-hot/10 p-3 rounded-xl border border-hot/20">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,211,102,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> : (
                  <>
                    {isLogin ? 'Sign In Now' : 'Create Account'}
                    <ArrowRight size={24} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center text-text-muted font-bold text-sm">
              <span className="opacity-50">{isLogin ? "No get account?" : "Already get account?"}</span>
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-accent border-b-2 border-accent/20 hover:border-accent transition-colors"
                disabled={loading}
              >
                {isLogin ? 'Register Abeg' : 'Sign in Oga'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="otp-step"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="space-y-8">
              <div className="flex justify-between gap-3">
                 {[0,1,2,3,4,5].map((i) => (
                    <input 
                      key={i}
                      type="number" 
                      maxLength={1}
                      className="w-full aspect-square bg-surface-2 rounded-2xl border-2 border-white/5 text-center text-2xl font-mono font-extrabold text-accent outline-none focus:border-accent transition-all"
                      value={otp[i] || ''}
                      onChange={(e) => {
                         const val = e.target.value.substring(0, 1);
                         const newOtp = otp.split('');
                         newOtp[i] = val;
                         setOtp(newOtp.join(''));
                         if (val && e.target.nextSibling) (e.target.nextSibling as HTMLInputElement).focus();
                      }}
                    />
                 ))}
              </div>

              {error && <p className="text-hot text-xs font-bold text-center bg-hot/10 p-3 rounded-xl border border-hot/20">{error}</p>}

              <button 
                onClick={verifyOTPAndAuth}
                disabled={otp.length < 6 || loading}
                className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,211,102,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div> : (
                  <>
                    Confirm OTP
                    <CheckCircle2 size={24} />
                  </>
                )}
              </button>

              <div className="text-center space-y-4">
                 <button className="text-sm font-bold text-text-muted/60 uppercase tracking-widest hover:text-text-primary transition-colors">Resend Code (59s)</button>
                 <br />
                 <button 
                   onClick={() => setStep('auth')}
                   className="text-xs font-bold text-hot/50 uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto"
                 >
                   <X size={12} /> Change Phone Number
                 </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto py-6 text-center">
         <p className="text-[10px] text-text-muted/40 uppercase tracking-[0.3em] font-bold">100% Secured for Naija 🇳🇬</p>
      </div>
    </div>
  )
}

export default Auth
