import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clipboard, Sparkles, ArrowLeft, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore, DEFAULT_FOLLOW_UP_DELAY_HOURS } from '../store/useStore'
import { useToast } from '../context/ToastContext'
import { trackMilestone } from '../lib/analytics'

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

  /**
   * Resilient, local on-device parser tailored for WhatsApp chats in Nigeria.
   * Handles:
   * - WhatsApp timestamps: [10:24 AM, 12/04/2026] Adaeze: Hi
   * - Nigerian phone numbers: 080..., +234...
   * - Nigerian currency syntax: ₦60,000, 60k, N60000, 60,000 naira
   * - Delivery constraints: Lekki, Abuja, dispatch, waybill, Friday, pickup
   */
  const handleExtract = () => {
    if (!rawText.trim()) return
    setExtracting(true)
    setError(null)

    setTimeout(() => {
      try {
        const text = rawText.trim()
        const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)

        // 1. Extract Phone Number if present
        let detectedPhone = ''
        const phoneMatch = text.match(/(?:\+234|0)(?:70|80|81|90|91)\d{8}/)
        if (phoneMatch) {
          detectedPhone = phoneMatch[0]
        }

        // 2. Extract Amount
        let parsedAmount = 0
        // Check for 60k, 185k shorthand
        const kMatch = text.match(/(\d+)\s*(?:k|thousand)\b/i)
        // Check for ₦, N, NGN prefix or standard currency
        const standardAmountMatch = text.match(/(?:₦|N|NGN|\b)\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{4,7})/i)

        if (kMatch) {
          parsedAmount = parseFloat(kMatch[1]) * 1000
        } else if (standardAmountMatch) {
          const clean = standardAmountMatch[1].replace(/,/g, '')
          parsedAmount = parseFloat(clean) || 0
        }

        // 3. Extract Customer Name
        // Strip WhatsApp timestamp prefixes like "[10:24 AM] Ada: " or "10/24/26, 2:14 PM - Ada: "
        let detectedName = ''
        for (const line of lines) {
          const chatMatch = line.match(/(?:\[?\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?\]?|\d{1,2}\/\d{1,2}\/\d{2,4}.*?[-:]\s*)([^:]{2,25}):/i)
          if (chatMatch) {
            const candidate = chatMatch[1].trim()
            if (!/^(you|me|vendor|admin|seller)$/i.test(candidate)) {
              detectedName = candidate
              break
            }
          }
        }

        if (!detectedName) {
          // If no timestamp, look for "Ada:" or take first line if short
          const colonMatch = lines[0]?.match(/^([^:]{2,20}):/)
          if (colonMatch) {
            detectedName = colonMatch[1].trim()
          } else {
            const firstLine = lines[0] || 'WhatsApp Customer'
            detectedName = firstLine.length > 25 ? 'WhatsApp Customer' : firstLine
          }
        }

        // 4. Extract Constraint / Location
        let detectedConstraint = ''
        const constraintKeywords = text.match(/(?:deliver(?:y)? to|waybill to|dispatch to|pickup at|hold till|send to)\s+([^,.\n]+)/i)
        if (constraintKeywords) {
          detectedConstraint = constraintKeywords[0].trim()
        }

        // 5. Extract Product Name
        // Look for common merchandise keywords or fallback to 2nd line
        let detectedProduct = ''
        const merchandiseMatch = text.match(/(?:for the|about the|on the|price of|buy|order)\s+([^?!\n.,]{3,40})/i)
        if (merchandiseMatch) {
          detectedProduct = merchandiseMatch[1].trim()
        } else {
          detectedProduct = lines.find((l) => l.length > 5 && !l.includes(detectedName))?.slice(0, 40) || 'Inquired Item'
        }

        setCustomerName(detectedName)
        setCustomerPhone(detectedPhone)
        setProductName(detectedProduct)
        setAmount(parsedAmount ? parsedAmount.toString() : '0')
        setConstraint(detectedConstraint)

        trackMilestone('first_capture', { text_length: rawText.length, has_amount: parsedAmount > 0 })
        setShowConfirm(true)
      } catch (err) {
        console.error('[Parser error]', err)
        setError('Failed to auto-parse. You can edit the fields manually below.')
        setShowConfirm(true)
      } finally {
        setExtracting(false)
      }
    }, 400)
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
        lost_at: null,
      })

      trackMilestone('first_deal_created', {
        amount: parseFloat(amount) || 0,
        customer_name: customerName.trim(),
      })

      toast('Opportunity added to Today queue! 🚀', 'success')
      navigate('/today')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save deal. Please try again.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {!showConfirm ? (
        <div className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-text-primary font-display">Capture Conversation</h2>
            <p className="text-xs text-text-muted">
              Paste raw WhatsApp or Instagram chat text. Zero data stays on our servers—it extracts into a card and raw text is discarded.
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={7}
                placeholder={`Paste WhatsApp transcript here... e.g.\nAda: Hi Sis, how much is the burgundy lace (5 yards)?\nVendor: It is ₦60,000.\nAda: Okay will take it, deliver to Lekki on Thursday.`}
                className="w-full bg-surface border border-surface-border rounded-2xl p-4 text-xs text-text-primary placeholder:text-text-muted/40 outline-none focus:border-accent transition-all resize-none leading-relaxed font-body shadow-sm"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="flex-1 bg-surface-2 text-text-primary font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all border border-surface-border"
              >
                <Clipboard size={16} />
                <span>Paste Clipboard</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleExtract}
            disabled={!rawText.trim() || extracting}
            className="w-full bg-accent text-white dark:text-background font-extrabold py-4 rounded-2xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(217,119,6,0.2)] hover:opacity-95"
          >
            {extracting ? (
              <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={20} />
                <span>Extract Deal Details</span>
              </>
            )}
          </button>

          {/* Privacy Guarantee reassurance */}
          <div className="p-3 bg-surface-2 rounded-xl border border-surface-border flex items-center gap-2 text-[11px] text-text-muted">
            <ShieldCheck size={14} className="text-accent-whatsapp shrink-0" />
            <span>On-device parsing: customer chat text is never permanently saved or shared.</span>
          </div>
        </div>
      ) : (
        /* Confirmation Screen */
        <motion.form
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSaveDeal}
          className="bg-surface border border-surface-border rounded-3xl p-6 space-y-5 shadow-xl"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <Sparkles size={20} className="text-accent" />
            <div>
              <h3 className="text-base font-bold text-text-primary">I found a potential sale</h3>
              <p className="text-xs text-text-muted">Verify details before saving</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">
                Customer Name
              </label>
              <input
                required
                type="text"
                className="w-full bg-surface-2 border border-surface-border rounded-xl py-3 px-3.5 text-xs text-text-primary outline-none focus:border-accent font-body"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">
                Customer Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="+234..."
                className="w-full bg-surface-2 border border-surface-border rounded-xl py-3 px-3.5 text-xs text-text-primary outline-none focus:border-accent font-mono"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">
                Product / Service Title
              </label>
              <input
                required
                type="text"
                className="w-full bg-surface-2 border border-surface-border rounded-xl py-3 px-3.5 text-xs text-text-primary outline-none focus:border-accent font-body"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">
                Amount (₦)
              </label>
              <input
                required
                type="number"
                min="0"
                step="500"
                className="w-full bg-surface-2 border border-surface-border rounded-xl py-3 px-3.5 text-xs font-mono font-bold text-accent outline-none focus:border-accent"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">
                Constraint / Delivery Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Deliver to Lekki Phase 1 on Thursday"
                className="w-full bg-surface-2 border border-surface-border rounded-xl py-3 px-3.5 text-xs text-text-primary outline-none focus:border-accent font-body"
                value={constraint}
                onChange={(e) => setConstraint(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="flex-1 bg-surface-2 text-text-primary font-bold py-3.5 rounded-2xl text-xs active:scale-95 transition-all border border-surface-border"
            >
              Re-edit Text
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-success text-white font-extrabold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
