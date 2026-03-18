import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Flame, Sparkles, Copy, CheckCircle2, Save, Trash2, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import axios from 'axios'
import { useStore } from '../store/useStore'

const SabiAI: React.FC = () => {
  const { user } = useStore()
  const [chatText, setChatText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleAnalyze = async () => {
    if (!chatText.trim()) return
    setAnalyzing(true)
    setResult(null)
    setError(null)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/extract-deal`, { 
        chatText 
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      })
      
      setResult(response.data)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || 'AI analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSaveAsDeal = async () => {
    if (!result || !user) return
    setSaving(true)
    try {
      // 1. Create/Find generic contact for this AI session
      const { data: contact } = await supabase
        .from('contacts')
        .insert([{
          user_id: user.id,
          name: result.title?.split(' ')[0] || 'AI Prospect',
          phone: null,
          last_seen: new Date()
        }])
        .select()
        .single()

      if (!contact) throw new Error('Failed to create contact')

      // 2. Create Deal
      const { error: dealError } = await supabase
        .from('deals')
        .insert([{
          user_id: user.id,
          contact_id: contact.id,
          title: result.title || 'AI Extracted Deal',
          amount: result.amount || 0,
          status: 'pending',
          summary: result.summary,
          ai_suggested_reply: result.ai_reply,
          created_at: new Date()
        }])

      if (dealError) throw dealError
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error(err)
      setError('Failed to save deal.')
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="pb-20 pt-4">
      <div className="mb-8">
        <h2 className="text-3xl font-syne font-extrabold flex items-center gap-2">
          🤖 Sabi AI
        </h2>
        <p className="text-text-muted mt-2">Paste any WhatsApp chat. Sabi will tell you what to do next.</p>
      </div>

      <div className="space-y-6">
        {/* Input Area */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-accent/20 rounded-3xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
          <div className="relative bg-surface rounded-3xl border border-white/5 p-4 space-y-4">
            <textarea 
              className="w-full h-48 bg-transparent text-text-primary outline-none resize-none placeholder:text-text-muted/40 font-body leading-relaxed"
              placeholder="E.g.: 'Chidinma: Hi, do you have Ankara fabric in blue? How much for 6 yards?'"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
            />
            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={async () => setChatText(await navigator.clipboard.readText())}
                className="text-xs font-bold text-text-muted flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <Copy size={14} /> Paste from Clipboard
              </button>
              <button 
                onClick={() => setChatText('')}
                className="text-xs font-bold text-text-muted flex items-center gap-1.5 hover:text-hot transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>
        </div>

        {error && <div className="p-4 bg-hot/10 border border-hot/20 rounded-2xl text-hot text-xs font-bold text-center">{error}</div>}

        <button 
          onClick={handleAnalyze}
          disabled={!chatText.trim() || analyzing}
          className="w-full bg-accent text-primary font-extrabold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(37,211,102,0.2)] disabled:opacity-50 active:scale-95 transition-all"
        >
          {analyzing ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full"
              />
              Sabi is thinking...
            </>
          ) : (
            <>
              Analyze with Sabi
              <Sparkles size={24} />
            </>
          )}
        </button>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-6"
            >
              {/* Intent Badge */}
              <div className="flex justify-center">
                 <div className={`px-6 py-2 rounded-full border flex items-center gap-2 ${
                    result.is_deal ? 'bg-hot/10 border-hot text-hot' : 'bg-accent/10 border-accent text-accent'
                 }`}>
                   <Flame size={18} fill="currentColor" />
                   <span className="font-syne font-extrabold uppercase tracking-[0.2em] text-[10px]">
                      {result.is_deal ? '🔥 Hot Lead Detected' : '💬 Inquiry Only'}
                   </span>
                 </div>
              </div>

              {/* Deal Card */}
              <div className="bg-surface rounded-3xl border border-accent/20 overflow-hidden">
                 <div className="bg-accent/10 p-5 flex justify-between items-center border-b border-white/5">
                    <span className="text-sm font-syne font-extrabold text-accent uppercase tracking-widest">Extracted Deal</span>
                    <CheckCircle2 className="text-accent" size={20} />
                 </div>
                 <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-text-muted uppercase">Intent</label>
                          <p className="font-bold">{result.intent || 'Unknown'}</p>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-text-muted uppercase">Price</label>
                          <p className="font-mono font-bold text-accent">₦{(result.amount || 0).toLocaleString()}</p>
                       </div>
                       <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-text-muted uppercase">Title / Item</label>
                          <p className="font-medium text-lg">{result.title}</p>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-text-muted uppercase">Sabi Summary</label>
                       <p className="text-sm leading-relaxed text-text-primary bg-surface-2 p-4 rounded-2xl border border-white/5 italic">"{result.summary}"</p>
                    </div>

                    <div className="space-y-3 pt-2">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-text-muted uppercase">Suggested Reply</label>
                          <button 
                            onClick={() => handleCopy(result.ai_reply)}
                            className="text-xs font-bold text-accent flex items-center gap-1.5"
                          >
                            <Copy size={12} /> Copy Reply
                          </button>
                       </div>
                       <div className="bg-primary/40 p-4 rounded-2xl border border-accent/10 text-sm leading-relaxed">
                          {result.ai_reply}
                       </div>
                    </div>
                    
                    <button 
                      onClick={handleSaveAsDeal}
                      disabled={saving || saved}
                      className="w-full bg-surface-2 border border-accent/30 text-accent font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-accent/10 transition-colors disabled:opacity-50"
                    >
                       {saving ? <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div> : (
                         saved ? <>Saved to Pipeline <CheckCircle2 size={18} /></> : <><Save size={18} /> Save as Deal <ArrowRight size={18} /></>
                       )}
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SabiAI
