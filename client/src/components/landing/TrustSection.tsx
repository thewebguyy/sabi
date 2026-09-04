import React from 'react'
import { Lock, Smartphone, MessageCircle } from 'lucide-react'

interface TrustItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

const TrustItem: React.FC<TrustItemProps> = ({ icon, title, description }) => (
  <div className="bg-surface rounded-2xl border border-surface-border p-5 space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center text-success shrink-0">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-text-primary">{title}</h3>
    </div>
    <p className="text-xs text-text-muted leading-relaxed">{description}</p>
  </div>
)

const TrustSection: React.FC = () => {
  return (
    <section className="py-16 px-6" id="trust">
      <div className="max-w-md mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-3">
          Trust & Privacy
        </p>
        <h2 className="text-2xl font-display font-extrabold mb-8 leading-tight">
          Your customers are <span className="text-accent">your business.</span>
        </h2>

        <div className="space-y-3">
          <TrustItem
            icon={<Lock size={20} />}
            title="Your data stays yours"
            description="Sabi does not store raw WhatsApp chat logs. Conversations are processed to extract deal details, then discarded. We never sell or share your customer information."
          />
          <TrustItem
            icon={<MessageCircle size={20} />}
            title="Sabi doesn't send messages on your behalf"
            description="It helps you remember who to follow up with and prepares the message. You decide when to send it. You stay in full control of every customer interaction."
          />
          <TrustItem
            icon={<Smartphone size={20} />}
            title="No app download required"
            description="Sabi runs in your phone's browser. Works on any Android or iPhone. No storage space needed, no app store required."
          />
        </div>
      </div>
    </section>
  )
}

export default TrustSection
