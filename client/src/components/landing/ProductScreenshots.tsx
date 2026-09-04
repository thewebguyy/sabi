import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, MessageCircle, AlertCircle, Sparkles, Copy, ExternalLink, Clipboard } from 'lucide-react'

/**
 * ProductScreenshots — Shows stylized representations of the real Sabi UI.
 * These are built using the actual design tokens and component patterns
 * from Today.tsx, follow-up modal, and Capture.tsx.
 * No external images required — rendered as React components.
 */

const TodayScreenPreview: React.FC = () => (
  <div className="phone-frame mx-auto">
    <div className="h-full overflow-hidden">
      {/* Top bar */}
      <div className="bg-surface px-4 py-3 flex justify-between items-center border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-black text-[9px]">S</div>
          <span className="text-xs font-display font-extrabold text-text-primary">Ada's Fabrics</span>
        </div>
        <div className="flex items-center gap-1 bg-accent text-background font-bold px-2 py-1 rounded-lg text-[9px]">
          <Sparkles size={10} />
          <span>Capture</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2.5 bg-background">
        {/* Metric box */}
        <div className="bg-surface rounded-2xl border border-surface-border p-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-full blur-xl pointer-events-none" />
          <p className="text-[8px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Total Open Value</p>
          <p className="text-lg font-extrabold font-mono text-accent">₦385,000</p>
          <p className="text-[8px] text-text-muted">in open opportunities</p>
          <div className="mt-2 pt-2 border-t border-surface-border flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[8px] font-semibold text-text-primary">4 conversations need attention today</span>
          </div>
        </div>

        {/* Deal cards */}
        {[
          { name: 'Amaka O.', product: 'Burgundy Lace (5 yds)', amount: '₦60,000', quiet: '2 days' },
          { name: 'Chidera K.', product: 'Swiss Voile Bundle', amount: '₦145,000', quiet: '3 days' },
          { name: 'Funke A.', product: 'Ankara Set (Wedding)', amount: '₦180,000', quiet: '5 days' },
        ].map((deal, i) => (
          <div key={i} className="bg-surface border border-surface-border rounded-xl p-2.5 space-y-1.5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-text-primary">{deal.name}</span>
                  <span className="text-[7px] font-semibold bg-accent/15 text-accent px-1.5 py-0.5 rounded-full border border-accent/30">
                    quiet for {deal.quiet}
                  </span>
                </div>
                <p className="text-[8px] text-text-muted">{deal.product}</p>
              </div>
              <span className="text-[10px] font-bold font-mono text-accent">{deal.amount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex-1 bg-accent-whatsapp text-background font-extrabold py-1.5 rounded-lg text-[8px] flex items-center justify-center gap-1">
                <MessageCircle size={10} />
                <span>Follow Up</span>
              </div>
              <div className="bg-success/15 text-success border border-success/30 p-1.5 rounded-lg">
                <CheckCircle2 size={10} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const FollowUpPreview: React.FC = () => (
  <div className="phone-frame mx-auto">
    <div className="h-full overflow-hidden flex flex-col">
      {/* Dimmed background */}
      <div className="flex-1 bg-background/50 backdrop-blur-sm" />

      {/* Follow-up sheet */}
      <div className="bg-surface border-t border-surface-border rounded-t-3xl p-4 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-surface-border">
          <div>
            <p className="text-[10px] font-bold text-text-primary">Follow Up with Amaka O.</p>
            <p className="text-[8px] text-text-muted">Burgundy Lace · ₦60,000</p>
          </div>
          <div className="w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center text-text-muted text-[8px]">✕</div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Suggested Message</p>
          <div className="bg-background border border-surface-border rounded-xl p-2.5">
            <p className="text-[9px] text-text-primary leading-relaxed">
              Hi Amaka! Just checking in on your order for Burgundy Lace (5 yards) at ₦60,000. Let me know if you are still taking it so I can reserve it for you! 😊
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface-2 text-text-primary font-bold py-2 rounded-xl text-[8px] flex items-center justify-center gap-1.5">
            <Copy size={10} />
            <span>Copy Text</span>
          </div>
          <div className="bg-accent-whatsapp text-background font-extrabold py-2 rounded-xl text-[8px] flex items-center justify-center gap-1.5">
            <ExternalLink size={10} />
            <span>Open WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const CapturePreview: React.FC = () => (
  <div className="phone-frame mx-auto">
    <div className="h-full overflow-hidden">
      {/* Top bar */}
      <div className="bg-surface px-4 py-3 flex items-center gap-2 border-b border-surface-border">
        <span className="text-[10px] text-text-muted">←</span>
        <span className="text-xs font-display font-extrabold text-text-primary">Capture Conversation</span>
      </div>

      <div className="p-3 space-y-3 bg-background">
        {/* Paste button */}
        <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-xl px-3 py-2.5">
          <Clipboard size={14} className="text-accent" />
          <span className="text-[10px] font-bold text-accent">Paste from clipboard</span>
        </div>

        {/* Text area with pasted content */}
        <div className="bg-surface border border-surface-border rounded-xl p-3 min-h-[80px]">
          <p className="text-[9px] text-text-primary leading-relaxed">
            [9/2/26, 3:14 PM] Customer: Hi, is the burgundy lace still available?{'\n'}
            [9/2/26, 3:14 PM] Customer: How much for 5 yards?{'\n'}
            [9/2/26, 3:30 PM] You: Yes! ₦13,000 per yard. I can do ₦60,000 for 5 yards...
          </p>
        </div>

        {/* Extract button */}
        <div className="bg-accent text-background font-extrabold py-2.5 rounded-xl text-[10px] flex items-center justify-center gap-1.5">
          <Sparkles size={12} />
          <span>Extract Deal Info</span>
        </div>

        {/* Extracted fields */}
        <div className="space-y-2">
          <p className="text-[8px] font-bold uppercase tracking-wider text-success">✓ Extracted</p>
          {[
            ['Customer', 'Customer (from chat)'],
            ['Product', 'Burgundy Lace (5 yards)'],
            ['Amount', '₦60,000'],
          ].map(([label, value], i) => (
            <div key={i} className="bg-surface border border-surface-border rounded-lg px-3 py-2">
              <p className="text-[7px] text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-[9px] font-bold text-text-primary">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const ProductScreenshots: React.FC = () => {
  return (
    <section className="py-16 px-6" id="product">
      <div className="max-w-lg mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-3 text-center">
          The real product
        </p>
        <h2 className="text-2xl font-display font-extrabold mb-10 leading-tight text-center">
          This is what Sabi <span className="text-accent">actually looks like.</span>
        </h2>

        {/* Horizontal scroll on mobile */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory -mx-6 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="shrink-0 snap-center space-y-3 w-[280px]"
          >
            <TodayScreenPreview />
            <p className="text-center text-xs font-bold text-text-primary">Today Queue</p>
            <p className="text-center text-[10px] text-text-muted">See which conversations need your attention</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="shrink-0 snap-center space-y-3 w-[280px]"
          >
            <FollowUpPreview />
            <p className="text-center text-xs font-bold text-text-primary">1-Tap Follow-Up</p>
            <p className="text-center text-[10px] text-text-muted">Copy or send directly to WhatsApp</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="shrink-0 snap-center space-y-3 w-[280px]"
          >
            <CapturePreview />
            <p className="text-center text-xs font-bold text-text-primary">Paste & Capture</p>
            <p className="text-center text-[10px] text-text-muted">5 seconds to save a deal from being forgotten</p>
          </motion.div>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-4 italic">
          Sample data shown for illustration
        </p>
      </div>
    </section>
  )
}

export default ProductScreenshots
