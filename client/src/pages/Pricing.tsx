import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Briefcase, Rocket, ArrowLeft } from 'lucide-react'
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
  color: string
  border: string
  bg: string
  isPrimary: boolean
  features: PricingFeature[]
  ctaText: string
}

const PricingCard: React.FC<PlanConfig> = ({
  title,
  price,
  priceSuffix,
  subtitle,
  icon,
  color,
  border,
  bg,
  isPrimary,
  features,
  ctaText,
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-8 rounded-[40px] border relative overflow-hidden transition-all h-full flex flex-col ${border} ${bg}`}
  >
    <div className="mb-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} bg-white/5 mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-display font-extrabold mb-1">{title}</h3>
      <p className="text-text-muted text-[13px] font-medium leading-relaxed">{subtitle}</p>
    </div>

    <div className="mb-10 flex items-baseline gap-1">
      <span className="text-4xl font-mono font-extrabold text-text-primary">{price}</span>
      {priceSuffix && (
        <span className="text-text-muted text-sm font-bold uppercase tracking-widest">
          {priceSuffix}
        </span>
      )}
    </div>

    <div className="space-y-4 mb-12 flex-1">
      {features.map((f, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={`mt-0.5 rounded-full ${color}`}>
            <CheckCircle2 size={16} fill="currentColor" className="text-transparent" strokeWidth={3} />
          </div>
          <p className="text-sm font-medium text-text-primary leading-tight">{f.text}</p>
        </div>
      ))}
    </div>

    <Link
      to="/auth"
      className={`w-full py-5 rounded-2xl font-extrabold text-lg text-center transition-all active:scale-[0.98] block ${
        isPrimary
          ? 'bg-accent text-background shadow-[0_15px_35px_rgba(255,176,32,0.2)]'
          : 'bg-surface-2 text-text-muted border border-white/10 hover:border-accent hover:text-accent'
      }`}
    >
      {ctaText}
    </Link>
  </motion.div>
)

const plans: PlanConfig[] = [
  {
    title: 'Free',
    price: '₦0',
    subtitle: 'Try Sabi and recover your first opportunities.',
    icon: <Briefcase size={32} />,
    color: 'text-text-muted',
    border: 'border-white/5',
    bg: 'bg-surface',
    isPrimary: false,
    features: [
      { text: 'Track up to 15 active deals' },
      { text: 'Follow-up message generation' },
      { text: 'Paste-to-capture extraction' },
      { text: 'WhatsApp deep-link follow-ups' },
      { text: 'Works on any phone browser' },
    ],
    ctaText: 'Get Started',
  },
  {
    title: 'Paid',
    price: '₦4,900',
    priceSuffix: '/mo',
    subtitle: 'More memory. More follow-ups. Less lost money.',
    icon: <Rocket size={32} />,
    color: 'text-accent',
    border: 'border-accent/40',
    bg: 'bg-primary/20',
    isPrimary: true,
    features: [
      { text: 'Unlimited active deals' },
      { text: 'AI-powered follow-up drafts' },
      { text: 'Automated cold-deal alerts' },
      { text: 'Revenue tracking & won deals' },
      { text: 'Priority support' },
    ],
    ctaText: 'Start with Paid',
  },
]

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary font-body pb-24 pt-4 px-4">
      <div className="max-w-md mx-auto space-y-12">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-extrabold leading-[1.1]">
            Simple pricing.{' '}
            <span className="text-accent">Start free.</span>
          </h1>
          <p className="text-text-muted text-lg tracking-tight">
            Upgrade when your business needs more.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="space-y-6">
          {plans.map((plan, i) => (
            <PricingCard key={i} {...plan} />
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-text-muted">
            No credit card required to start. Cancel anytime.
          </p>
          <p className="text-[11px] text-text-muted">
            Sabi is not affiliated with WhatsApp or Meta.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pricing
