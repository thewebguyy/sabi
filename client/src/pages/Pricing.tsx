import React from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowLeft, Briefcase, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PricingFeature {
  text: string
}

interface PlanConfig {
  title: string
  price: string
  priceSuffix?: string
  subtitle: string
  icon: React.ReactNode
  isPrimary: boolean
  features: PricingFeature[]
  ctaText: string
}

const plans: PlanConfig[] = [
  {
    title: 'Free',
    price: '₦0',
    subtitle: 'Try Sabi and recover your first lost customer conversations.',
    icon: <Briefcase size={22} className="text-text-muted" />,
    isPrimary: false,
    features: [
      { text: 'Track up to 15 active conversations' },
      { text: 'Smart follow-up reminder alerts' },
      { text: 'Paste-to-capture deal extraction' },
      { text: '1-tap WhatsApp message deep-links' },
      { text: 'Works in Safari, Chrome & mobile browser' },
    ],
    ctaText: 'Start Free',
  },
  {
    title: 'Paid',
    price: '₦4,900',
    priceSuffix: '/month',
    subtitle: 'Unlimited memory for high-volume social commerce vendors.',
    icon: <Zap size={22} className="text-accent" />,
    isPrimary: true,
    features: [
      { text: 'Unlimited active conversations' },
      { text: 'Context-rich follow-up draft generation' },
      { text: 'Custom quiet-time alert thresholds' },
      { text: 'Recovered revenue & won deal tracking' },
      { text: 'Direct WhatsApp support' },
    ],
    ctaText: 'Start Free — Upgrade Anytime',
  },
]

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0D0B] text-text-primary font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-extrabold text-accent">sabi</span>
            <span className="font-mono text-[10px] text-text-muted">· PRICING</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
          <p className="editorial-kicker text-accent">Transparent Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-text-primary leading-[1.08]">
            Simple, honest pricing. <br />
            <span className="text-accent">Zero hidden fees.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            Recovering just one forgotten ₦20,000 order pays for 4 months of Sabi.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className={`rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-all ${
                plan.isPrimary
                  ? 'bg-[#121513] border-2 border-accent shadow-2xl relative'
                  : 'bg-[#121513] border border-[#232B25]'
              }`}
            >
              {plan.isPrimary && (
                <span className="absolute -top-3 right-6 font-mono text-[10px] font-bold text-background bg-accent px-3 py-1 rounded-full uppercase tracking-wider">
                  Recommended for busy vendors
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1F1B] border border-[#242C26] flex items-center justify-center">
                    {plan.icon}
                  </div>
                  <h2 className="font-display font-extrabold text-2xl text-text-primary">
                    {plan.title}
                  </h2>
                </div>

                <p className="text-sm text-text-muted mb-6 leading-relaxed">
                  {plan.subtitle}
                </p>

                <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-[#1F2521]">
                  <span className="font-mono text-4xl sm:text-5xl font-extrabold text-text-primary">
                    {plan.price}
                  </span>
                  {plan.priceSuffix && (
                    <span className="font-mono text-xs text-text-muted font-bold">
                      {plan.priceSuffix}
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3.5 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.isPrimary
                            ? 'bg-accent/20 text-accent'
                            : 'bg-white/10 text-text-muted'
                        }`}
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span className="text-sm text-text-primary leading-snug">
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/auth"
                className={`w-full py-4 rounded-xl font-bold text-sm text-center transition-all active:scale-[0.98] ${
                  plan.isPrimary
                    ? 'bg-accent text-background hover:bg-[#ffba33] shadow-[0_4px_20px_rgba(255,176,32,0.2)]'
                    : 'bg-[#1A1F1B] border border-[#242C26] text-text-primary hover:border-accent'
                }`}
              >
                {plan.ctaText}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-14 max-w-2xl mx-auto p-5 rounded-xl bg-[#121513] border border-[#232B25] text-center space-y-2">
          <p className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
            Try Free with No Risk
          </p>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            No debit card required to sign up. Every account starts on the free tier with 15 conversation slots.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Pricing
