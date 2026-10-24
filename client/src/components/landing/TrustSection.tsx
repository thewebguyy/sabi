import React, { useState } from 'react'
import { ShieldCheck, UserCheck, Smartphone, Database, CheckCircle } from 'lucide-react'

const principles = [
  {
    icon: <Database size={20} className="text-accent" />,
    title: 'Zero raw chat storage',
    description:
      'Sabi processes customer chats strictly on-device in your browser. Once deal details (name, item, amount) are structured into a card, the raw text is discarded forever.',
    badge: 'On-Device Parsing',
  },
  {
    icon: <UserCheck size={20} className="text-accent-whatsapp" />,
    title: 'You control every message sent',
    description:
      'Sabi never messages your customers autonomously. It prepares the text and opens your real WhatsApp with the draft loaded. You review, edit if desired, and tap Send yourself.',
    badge: 'Merchant Approval',
  },
  {
    icon: <Smartphone size={20} className="text-accent" />,
    title: 'Zero app store download needed',
    description:
      'Runs instantly in your phone browser (Chrome, Safari). No 200MB app taking up precious phone memory. Add to home screen in 2 taps for an offline-capable PWA experience.',
    badge: 'Lightweight PWA',
  },
  {
    icon: <ShieldCheck size={20} className="text-accent-whatsapp" />,
    title: 'Zero risk of WhatsApp account ban',
    description:
      'No Meta API connection. No QR code scanning. No third-party bots hooking into your WhatsApp session. Your WhatsApp account stays 100% compliant and protected.',
    badge: '100% Ban Safe',
  },
]

const TrustSection: React.FC = () => {
  return (
    <section className="py-20 px-6 border-t border-surface-border" id="trust">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="mb-12 space-y-3">
          <p className="editorial-kicker text-accent">Trust & Privacy Architecture</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold leading-[1.08] text-text-primary max-w-2xl">
            Your customer conversations are <br />
            <span className="text-accent">your livelihood.</span>
          </h2>
          <p className="text-base sm:text-lg text-text-muted max-w-xl">
            We built Sabi respecting how African vendors actually run their businesses on WhatsApp: zero account risks, zero leaks, and zero third-party bots.
          </p>
        </div>

        {/* Highlighted Ban Safety & Privacy Banner */}
        <div className="bg-surface rounded-2xl border border-surface-border p-6 sm:p-7 relative overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-whatsapp/15 border border-accent-whatsapp/30 text-accent-whatsapp text-xs font-mono font-bold">
                <ShieldCheck size={14} />
                <span>ANTI-BAN ARCHITECTURE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
                Why Sabi Will Never Put Your WhatsApp at Risk
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Most automation tools require scanning a QR code or linking unofficial WhatsApp web clients. Meta detects these as suspicious automation and permanently bans vendor numbers. Sabi runs entirely outside Meta's internal servers—using your browser's native copy-paste and standard WhatsApp URL links.
              </p>
            </div>

            <div className="md:col-span-5 bg-surface-2 rounded-xl border border-surface-border p-4 space-y-2.5 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2 text-text-primary">
                <CheckCircle size={14} className="text-accent-whatsapp" />
                <span>No QR Code Connection</span>
              </div>
              <div className="flex items-center gap-2 text-text-primary">
                <CheckCircle size={14} className="text-accent-whatsapp" />
                <span>No Meta Business API Login</span>
              </div>
              <div className="flex items-center gap-2 text-text-primary">
                <CheckCircle size={14} className="text-accent-whatsapp" />
                <span>No Background Auto-Messaging</span>
              </div>
              <div className="flex items-center gap-2 text-text-primary">
                <CheckCircle size={14} className="text-accent-whatsapp" />
                <span>No Customer Number Sharing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {principles.map((p, idx) => (
            <div
              key={idx}
              className="bg-surface rounded-xl border border-surface-border p-6 space-y-3 hover:border-accent/40 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-2 border border-surface-border flex items-center justify-center shrink-0">
                    {p.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    {p.title}
                  </h3>
                </div>
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-surface-2 border border-surface-border text-text-muted">
                  {p.badge}
                </span>
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
