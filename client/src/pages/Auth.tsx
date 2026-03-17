import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Phone, Lock, Building, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    password: ''
  })

  const navigate = useNavigate()
  const { setUser } = useStore()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        // In a real app with phone auth, we'd use supabase.auth.signInWithPassword 
        // using the phone as email or a custom provider. 
        // For MVP, we'll use a hack or just mock the successful login for now 
        // since Supabase phone auth requires a real SMS provider setup.
        const { data, error } = await supabase.auth.signInWithPassword({
          email: `${formData.phone}@sabi.app`, // Mocking phone as email for MVP
          password: formData.password
        })
        
        if (error) throw error
        
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        setUser(profile)
        navigate('/dashboard')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: `${formData.phone}@sabi.app`,
          password: formData.password,
          options: {
            data: {
              business_name: formData.businessName,
              phone: formData.phone
            }
          }
        })
        
        if (error) throw error
        
        if (data.user) {
          // Create user profile in 'users' table
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              { 
                id: data.user.id, 
                phone: formData.phone, 
                business_name: formData.businessName 
              }
            ])
          
          if (profileError) throw profileError
          
          setUser({
            id: data.user.id,
            phone: formData.phone,
            business_name: formData.businessName,
            currency: 'NGN',
            whatsapp_connected: false,
            plan: 'free'
          })
          navigate('/connect')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="flex flex-col items-center mb-4">
            <span className="text-4xl font-syne font-extrabold text-accent leading-none">sabi</span>
            <span className="text-[10px] text-text-muted font-medium tracking-widest uppercase mt-1">you sabi your business</span>
          </Link>
        </div>

        <div className="bg-surface rounded-3xl border border-white/5 p-6 shadow-2xl overflow-hidden relative">
          <div className="flex mb-8 bg-surface-2 p-1 rounded-xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-surface text-accent shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-surface text-accent shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-text-muted uppercase ml-1">Business Name</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. Trendy Outfits"
                      required={!isLogin}
                      className="w-full bg-surface-2 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-text-primary focus:border-accent/50 outline-none transition-all placeholder:text-text-muted/50"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/10 pr-2">
                  <span className="text-sm font-bold">🇳🇬</span>
                  <span className="text-sm font-medium text-text-muted">+234</span>
                </div>
                <input 
                  type="tel" 
                  placeholder="8012345678"
                  required
                  className="w-full bg-surface-2 border border-white/5 rounded-xl py-4 pl-24 pr-4 text-text-primary focus:border-accent/50 outline-none transition-all placeholder:text-text-muted/50 font-mono"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-2 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-text-primary focus:border-accent/50 outline-none transition-all placeholder:text-text-muted/50"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="bg-hot/10 border border-hot/20 text-hot p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-accent text-primary font-extrabold py-4 rounded-xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Log In' : 'Create Account'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-text-muted text-sm mt-8">
          By continuing, you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}

export default Auth
