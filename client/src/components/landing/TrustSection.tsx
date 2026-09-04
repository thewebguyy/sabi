import React from 'react'
import { ShieldCheck, UserCheck, Smartphone, Database } from 'lucide-react'

const principles = [
  {
    icon: <Database size={20} className="text-accent" />,
    title: 'No raw chat storage',
    description:
      'Sabi does not keep logs of your private customer chats. Once the deal details (name, item, amount) are captured, raw text is discarded.',
  },
  {
    icon: <UserCheck size={20} className="text-[#25D366]" />,
    title: 'You control every message sent',
    description:
      'Sabi never messages your customers behind your back. It prepares the text and opens your real WhatsApp. You review and tap Send yourself.',
  },
  {
    icon: <Smartphone size={20} className="text-accent" />,
    title: 'Zero app store download needed',
    description:
      'Runs instantly in your phone browser (Chrome, Safari). No 200MB app taking up phone space. Add to your home screen in 3 taps.',
  },
  {
    icon: <ShieldCheck size={20} className="text-[#25D366]" />,
    title: 'Your customer list is yours alone',
    description:
      'We do not sell, rent, or share customer contact numbers with any third parties or advertisers. Your business data remains strictly confidential.',
  },
]

const TrustSection: React.FC = () => {
  return (
    <section className="py-20 px-6 border-t border-[#1C221E]" id="trust">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 space-y-3">
          <p className="editorial-kicker text-accent">Trust & Privacy Architecture</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold leading-[1.08] text-text-primary max-w-2xl">
            Your customers are <br />
            <span className="text-accent">your livelihood.</span>
          </h2>
          <p className="text-base sm:text-lg text-text-muted max-w-xl">
            We built Sabi respecting how African vendors actually run their businesses on WhatsApp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {principles.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#121513] rounded-xl border border-[#232B25] p-6 space-y-3 hover:border-[#2D3830] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#181D1A] border border-[#242C26] flex items-center justify-center shrink-0">
                  {p.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-text-primary">
                  {p.title}
                </h3>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
