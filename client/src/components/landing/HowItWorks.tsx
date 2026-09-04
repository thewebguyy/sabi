import React from 'react'
import { ArrowUpRight } from 'lucide-react'

const steps = [
  {
    step: '01',
    kicker: 'CAPTURE IN SECONDS',
    title: 'Paste or share a WhatsApp chat',
    description:
      'Copy the chat text from WhatsApp into Sabi. Takes 5 seconds. No complex CRM forms, no contact database setup.',
    detail: 'Customer name, product description, and agreed amount are instantly detected.',
  },
  {
    step: '02',
    kicker: 'AUTOMATIC TIMER',
    title: 'Sabi tracks the silence',
    description:
      'If the customer has not replied in 2 days, Sabi flags the conversation as an at-risk opportunity on your Today screen.',
    detail: 'Categorizes by Naira value and urgency so you always know who to follow up with first.',
  },
  {
    step: '03',
    kicker: 'ONE-TAP ACTION',
    title: 'Follow up directly in WhatsApp',
    description:
      'Tap Follow Up. Sabi composes a polite, context-aware message and opens your official WhatsApp with the text pre-loaded.',
    detail: 'You review it, hit Send, and keep the sale alive before the customer buys from someone else.',
  },
]

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 px-6 border-t border-[#1C221E]" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-14 space-y-3">
          <p className="editorial-kicker text-accent">How Sabi Operates</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-display font-extrabold leading-[1.08] text-text-primary max-w-2xl">
            Three steps. Zero forms. <br />
            <span className="text-text-muted">No admin work.</span>
          </h2>
          <p className="text-base sm:text-lg text-text-muted max-w-xl">
            You don't need another complicated dashboard. You just need to know who owes you a reply.
          </p>
        </div>

        {/* Editorial Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-[#121513] rounded-2xl border border-[#232B25] p-6 flex flex-col justify-between hover:border-accent/30 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2521]">
                  <span className="font-mono text-2xl font-bold text-accent">
                    {s.step}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider px-2 py-0.5 rounded bg-[#1A1F1B] border border-[#232B25]">
                    {s.kicker}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-display font-bold text-text-primary mb-3 leading-snug group-hover:text-accent transition-colors">
                  {s.title}
                </h3>

                <p className="text-sm text-text-muted leading-relaxed mb-4">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1F2521]">
                <p className="font-mono text-xs text-[#8E9490] leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Direct vendor takeaway */}
        <div className="mt-8 p-4 sm:p-5 rounded-xl bg-[#141815] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
            <p className="text-xs sm:text-sm text-text-primary font-medium">
              No Meta account connection required. Works with regular WhatsApp and WhatsApp Business.
            </p>
          </div>
          <a
            href="#simulator"
            className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline shrink-0"
          >
            <span>See the flow in action</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
