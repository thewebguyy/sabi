import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clipboard, Sparkles, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore, DEFAULT_FOLLOW_UP_DELAY_HOURS } from '../store/useStore'
import { useToast } from '../context/ToastContext'

export const Capture: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { createDeal } = useStore()
  const { toast } = useToast()

  const [rawText, setRawText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Confirmation Form Fields
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [productName, setProductName] = useState('')
  const [amount, setAmount] = useState('')
  const [constraint, setConstraint] = useState('')
  const [saving, setSaving] = useState(false)

  // Check URL query param from Web Share Target
  useEffect(() => {
    const sharedText = searchParams.get('text') || searchParams.get('title') || searchParams.get('url')
    if (sharedText) {
      setRawText(sharedText)
    }
  }, [searchParams])

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setRawText(text)
        toast('Pasted from clipboard!', 'success')
      }
    } catch {
      toast('Clipboard access blocked. Please paste manually into the box.', 'error')
    }
  }

  // Simple heuristic/naive fallback parser for client-side instant extraction
  // (In Slice 3, this connects to the AI edge function abstraction)
  const handleExtract = () => {
    if (!rawText.trim()) return
    setExtracting(true)
    setError(null)

    setTimeout(() => {
      // Heuristic extraction
      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean)
      
      // Try finding amount (numbers with ₦ or k)
      const amountMatch = rawText.match(/(?:₦|N|NGN|\b)\s*([0-[#FFB020]0-9,]{3,})/i)
      let parsedAmount = 0
      if (amountMatch) {
        const clean = amountMatch[1].replace(/,/g, '')
        parsedAmount = parseFloat(clean) || 0
      }

      // Try finding customer name (first line or word)
      const firstLine = lines[0] || 'WhatsApp Customer'
      const cleanName = firstLine.length > 30 ? 'WhatsApp Lead' : firstLine

      setCustomerName(cleanName)
      setCustomerPhone('')
      setProductName(lines[1] || 'Social Commerce Item')
      setAmount(parsedAmount ? parsedAmount.toString() : '0')
      setConstraint('')

      setExtracting(false)
      setShowConfirm(true)
    }, 600)
  }

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !productName.trim()) return

    setSaving(true)
    setError(null)
    try {
      const now = new Date()
      const dueTime = new Date(now.getTime() + DEFAULT_FOLLOW_UP_DELAY_HOURS * 3600 * 1000).toISOString()

      await createDeal({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim() || null,
        product_name: productName.trim(),
        amount: parseFloat(amount) || 0,
        currency: 'NGN',
        status: 'open',
        customer_constraint: constraint.trim() || null,
        captured_at: now.toISOString(),
        last_vendor_contact_at: now.toISOString(),
        last_customer_response_at: null,
        follow_up_due_at: dueTime,
        won_at: null,
        lost_at: null
      })

      toast('Opportunity saved!', 'success')
      navigate('/today')
    } catch (err: any) {
      setError(err.message || 'Failed to save deal. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-[#8E8E93] hover:text-[#F3F2EF]"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {!showConfirm ? (
        <div className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-[#F3F2EF]">Capture Conversation</h2>
            <p className="text-xs text-[#8E8E93]">
              Paste raw WhatsApp or Instagram chat text to extract deal details.
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={7}
                placeholder="Paste WhatsApp transcript here... e.g.
Ada: Hi, how much is the brown dress?
Vendor: It is ₦85,000.
Ada: Okay I will take it, deliver to Lekki on Friday."
                className="w-full bg-[#141414] border border-[#262626] rounded-2xl p-4 text-xs text-[#F3F2EF] placeholder:text-[#8E8E93]/40 outline-none focus:border-[#FFB020]/50 transition-all resize-none leading-relaxed"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="flex-1 bg-[#262626] text-[#F3F2EF] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Clipboard size={16} />
                <span>Paste Clipboard</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleExtract}
            disabled={!rawText.trim() || extracting}
            className="w-full bg-[#FFB020] text-[#0A0A0A] font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,176,32,0.2)]"
          >
            {extracting ? (
              <div className="w-6 h-6 border-3 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={20} />
                <span>Extract Deal Details</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Confirmation Screen */
        <motion.form
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSaveDeal}
          className="bg-[#141414] border border-[#262626] rounded-3xl p-6 space-y-5"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-[#262626]">
            <Sparkles size={20} className="text-[#FFB020]" />
            <div>
              <h3 className="text-base font-bold text-[#F3F2EF]">I found a potential sale</h3>
              <p className="text-xs text-[#8E8E93]">Verify details before saving</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                Customer Name
              </label>
              <input
                required
                type="text"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl py-3 px-3.5 text-xs text-[#F3F2EF] outline-none focus:border-[#FFB020]/50"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                Customer Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="+234..."
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl py-3 px-3.5 text-xs text-[#F3F2EF] outline-none focus:border-[#FFB020]/50"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                Product / Service Title
              </label>
              <input
                required
                type="text"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl py-3 px-3.5 text-xs text-[#F3F2EF] outline-none focus:border-[#FFB020]/50"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                Amount (₦)
              </label>
              <input
                required
                type="number"
                min="0"
                step="500"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl py-3 px-3.5 text-xs font-mono font-bold text-[#FFB020] outline-none focus:border-[#FFB020]/50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                Constraint / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Needs delivery by Friday"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl py-3 px-3.5 text-xs text-[#F3F2EF] outline-none focus:border-[#FFB020]/50"
                value={constraint}
                onChange={(e) => setConstraint(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="flex-1 bg-[#262626] text-[#F3F2EF] font-bold py-3.5 rounded-2xl text-xs active:scale-95 transition-all"
            >
              Re-edit Text
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#10B981] text-[#0A0A0A] font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Save Deal</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  )
}

export default Capture
