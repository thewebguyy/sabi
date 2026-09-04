import React from 'react'
import { Clipboard, Sparkles, MessageCircle } from 'lucide-react'

interface StepProps {
  number: number
  icon: React.ReactNode
  title: string
  description: string
}

const Step: React.FC<StepProps> = ({ number, icon, title, description }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
        {icon}
      </div>
      {number < 3 && (
        <div className="w-px h-full bg-surface-border mt-2" />
      )}
    </div>
    <div className="pb-8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">
        Step {number}
      </p>
      <h3 className="text-base font-bold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  </div>
)

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 px-6" id="how-it-works">
      <div className="max-w-md mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-3">
          How it works
        </p>
        <h2 className="text-2xl font-display font-extrabold mb-8 leading-tight">
          Three steps. No forms.<br />
          <span className="text-text-muted">No admin work.</span>
        </h2>

        <div className="space-y-0">
          <Step
            number={1}
            icon={<Clipboard size={20} />}
            title="Share or paste a chat"
            description="Copy a WhatsApp conversation into Sabi. Takes 5 seconds."
          />
          <Step
            number={2}
            icon={<Sparkles size={20} />}
            title="Sabi finds the opportunity"
            description="We extract the customer name, product, and amount. No forms to fill."
          />
          <Step
            number={3}
            icon={<MessageCircle size={20} />}
            title="Follow up in one tap"
            description="When the deal goes quiet, Sabi tells you. Tap to open WhatsApp with the message ready."
          />
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
