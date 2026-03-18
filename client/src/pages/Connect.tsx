import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Smartphone, CheckCircle2, ChevronRight, MessageSquare, Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useStore } from '../store/useStore'

const Connect: React.FC = () => {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const { user } = useStore()

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep(3), 800)
            return 100
          }
          return prev + 5
        })
      }, 150)
      return () => clearInterval(interval)
    }
  }, [step])

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
    else navigate('/dashboard')
  }

  const steps = [
    { title: 'Link', icon: <QrCode size={16} /> },
    { title: 'Learn', icon: <MessageSquare size={16} /> },
    { title: 'Start', icon: <CheckCircle2 size={16} /> },
  ]

  return (
    <div className="min-h-screen bg-background text-text-primary px-6 pt-12">
      {/* Progress Dots */}
      <div className="flex justify-center items-center gap-12 mb-16 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[1px] bg-surface-2 -z-10"></div>
         {steps.map((s, i) => (
           <div key={i} className="flex flex-col items-center gap-2">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${step > i + 1 ? 'bg-accent border-accent text-primary' : step === i + 1 ? 'border-accent text-accent' : 'border-surface-2 text-text-muted bg-surface'}`}>
               {s.icon}
             </div>
             <span className={`text-[10px] font-bold uppercase tracking-wider ${step === i + 1 ? 'text-accent' : 'text-text-muted'}`}>{s.title}</span>
           </div>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-syne font-extrabold mb-4">Connect your WhatsApp</h2>
              <p className="text-text-muted text-lg leading-relaxed px-4">Scan the code to let Sabi track your business deals.</p>
            </div>

            <div className="flex justify-center">
               <div className="p-8 bg-surface rounded-[40px] border-4 border-accent shadow-[0_0_50px_rgba(37,211,102,0.15)] relative">
                  <div className="flex items-center justify-center bg-white p-4 rounded-3xl">
                    <QRCodeSVG 
                      value={`https://sabi-crm.vercel.app/link?v=${user?.id || 'demo'}`} 
                      size={200}
                      fgColor="#0D0D0D"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-accent text-primary text-[10px] font-extrabold py-1 px-4 rounded-full uppercase tracking-widest whitespace-nowrap">
                    SCAN TO LINK
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-4 bg-surface-2 p-4 rounded-2xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-accent font-bold">1</div>
                <p className="text-sm font-medium">Open WhatsApp → Tap ⋮ → Linked Devices</p>
              </div>
              <div className="flex items-center gap-4 bg-surface-2 p-4 rounded-2xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-accent font-bold">2</div>
                <p className="text-sm font-medium">Link a Device → Scan the QR Code</p>
              </div>
            </div>

            <div className="bg-surface p-4 rounded-2xl text-center border border-accent/10">
               <span className="text-[11px] text-text-muted/70 leading-relaxed font-body">
                Sabi uses the <strong>official WhatsApp Business API</strong>.<br />
                We never read or store your personal messages.
               </span>
            </div>

            <button 
              onClick={nextStep}
              className="w-full bg-accent text-primary font-extrabold py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(37,211,102,0.2)]"
            >
              I've Scanned It
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-8"
          >
            <div className="relative w-40 h-40">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full shadow-[0_0_30px_rgba(37,211,102,0.2)]"
               />
               <div className="absolute inset-4 bg-surface rounded-full flex items-center justify-center overflow-hidden">
                 <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex flex-col items-center text-accent"
                 >
                   <Flame fill="currentColor" size={48} className="text-hot" />
                   <span className="font-syne font-extrabold text-xs mt-2 text-text-primary">SABI SYNC</span>
                 </motion.div>
               </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-syne font-extrabold">Learning your business...</h2>
              <p className="text-text-muted">Syncing your last 20 conversations.</p>
            </div>

            <div className="w-full max-w-[240px] h-2 bg-surface-2 rounded-full border border-white/5 overflow-hidden">
               <motion.div 
                 className="h-full bg-accent shadow-[0_0_15px_rgba(37,211,102,0.5)]"
                 animate={{ width: `${progress}%` }}
               />
            </div>
            
            <p className="text-[10px] text-accent font-bold uppercase tracking-widest animate-pulse">Scanning for leads...</p>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 border-2 border-accent text-accent mb-6 shadow-[0_0_40px_rgba(37,211,102,0.1)]">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-syne font-extrabold mb-4">You're ready!</h2>
              <p className="text-text-muted text-lg">Sabi found your first 3 deals.</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-surface p-5 rounded-3xl border border-white/5 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 py-1.5 px-3 bg-hot text-primary text-[10px] font-extrabold uppercase rounded-bl-xl tracking-tight">New Lead</div>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-accent">CH</div>
                <div className="flex-1">
                  <h4 className="font-bold text-base">Chidinma</h4>
                  <p className="text-xs text-text-muted">Ankara Fabric enquiry</p>
                  <p className="text-sm font-mono font-medium text-accent mt-1">₦15,000</p>
                </div>
              </div>

              <div className="bg-surface p-5 rounded-3xl border border-white/5 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 py-1.5 px-3 bg-hot text-primary text-[10px] font-extrabold uppercase rounded-bl-xl tracking-tight">New Lead</div>
                <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center font-bold text-text-primary">KU</div>
                <div className="flex-1">
                  <h4 className="font-bold text-base">Kunle</h4>
                  <p className="text-xs text-text-muted">Size 10 Sneakers</p>
                  <p className="text-sm font-mono font-medium text-text-muted mt-1">Price Pending</p>
                </div>
              </div>

              <div className="bg-surface p-5 rounded-3xl border border-white/5 flex items-center gap-4 relative overflow-hidden border-orange-500/20">
                <div className="absolute top-0 right-0 py-1.5 px-3 bg-gold text-primary text-[10px] font-extrabold uppercase rounded-bl-xl tracking-tight">Follow Up</div>
                <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center font-bold text-text-primary">BL</div>
                <div className="flex-1">
                  <h4 className="font-bold text-base">Blessing</h4>
                  <p className="text-xs text-text-muted">Waiting for payment</p>
                  <p className="text-sm font-mono font-medium text-gold mt-1">₦24,500</p>
                </div>
              </div>
            </div>

            <button 
              onClick={nextStep}
              className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-xl flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,211,102,0.2)]"
            >
              Take me to my dashboard
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Connect
