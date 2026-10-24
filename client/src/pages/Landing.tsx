import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowRight, MessageCircle, Clock, ExternalLink, ShieldCheck, Sparkles, CheckCircle2, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

import HeroVisualAnchor from '../components/landing/HeroVisualAnchor'
import ChatSimulator from '../components/landing/ChatSimulator'
import HowItWorks from '../components/landing/HowItWorks'
import ProductScreenshots from '../components/landing/ProductScreenshots'
import OpportunityCalculator from '../components/landing/OpportunityCalculator'
import TrustSection from '../components/landing/TrustSection'
import FAQSection from '../components/landing/FAQSection'

import { trackEvent } from '../lib/analytics'

const Landing: React.FC = () => {
  const [showStickyBar, setShowStickyBar] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    trackEvent('landing_view')

    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans overflow-x-hidden selection:bg-accent selection:text-white transition-colors duration-200">
      {/* ─── Top Editorial Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-baseline gap-3">
            <Link to="/" className="text-2xl sm:text-3xl font-display font-extrabold text-accent tracking-tight">
              sabi
            </Link>
            <span className="hidden sm:inline-block font-mono text-[10px] text-text-muted uppercase tracking-widest border-l border-surface-border pl-3">
              African Social Commerce Utility
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-text-muted">
              <a href="#how-it-works" className="hover:text-text-primary transition-colors">
                How It Works
              </a>
              <a href="#simulator" className="hover:text-text-primary transition-colors">
                Simulation
              </a>
              <a href="#product" className="hover:text-text-primary transition-colors">
                Product
              </a>
              <a href="#calculator" className="hover:text-text-primary transition-colors">
                Calculator
              </a>
              <Link to="/pricing" className="hover:text-text-primary transition-colors">
                Pricing
              </Link>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Warm Light'} mode`}
              className="p-2 rounded-xl bg-surface-2 border border-surface-border text-text-muted hover:text-text-primary hover:border-accent transition-all flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon size={16} className="text-text-primary" />
              ) : (
                <Sun size={16} className="text-accent" />
              )}
            </button>

            <Link
              to="/auth"
              onClick={() => trackEvent('start_free_click', { source: 'nav' })}
              className="px-4 sm:px-5 py-2 rounded-xl bg-accent text-white dark:text-background text-xs sm:text-sm font-extrabold hover:opacity-95 active:scale-[0.98] transition-all shadow-sm"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20">
        {/* ═══════════════════════════════════════════════════
            SECTION 1 — HERO (High Contrast & Multi-Deal Representation)
        ═══════════════════════════════════════════════════ */}
        <section className="px-6 pt-4 pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Bold Editorial Statement */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-surface-border shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-accent-whatsapp animate-pulse" />
                  <span className="font-mono text-[11px] font-bold text-accent uppercase tracking-wider">
                    Zero-Ban WhatsApp Sales Tracker
                  </span>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-6xl lg:text-[68px] font-display font-extrabold leading-[1.04] text-text-primary tracking-tight"
                >
                  You sell on WhatsApp. <br />
                  <span className="text-text-muted opacity-80">The chat gets buried.</span> <br />
                  <span className="text-text-muted opacity-80">The customer gets </span>
                  <span className="text-accent">forgotten.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg sm:text-xl text-text-muted max-w-xl leading-relaxed"
                >
                  Sabi tracks silence so you can revive high-intent buyers who went quiet before they buy from your competitors.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-2 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
                    <Link
                      to="/auth"
                      onClick={() => trackEvent('start_free_click', { source: 'hero' })}
                      className="group flex-1 bg-accent text-white dark:text-background font-extrabold py-4 px-6 rounded-xl text-base flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(217,119,6,0.25)]"
                    >
                      <span>Start Free — 15 Free Slots</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <p className="font-mono text-xs text-text-muted flex items-center gap-2">
                    <ShieldCheck size={14} className="text-accent-whatsapp shrink-0" />
                    <span>₦0 to start. No Meta connection. Runs in any mobile browser.</span>
                  </p>
                </motion.div>

                {/* Social Proof Banner */}
                <div className="pt-4 border-t border-surface-border flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-text-muted">
                  <span className="text-text-primary font-bold">Trusted by merchants in:</span>
                  <span>📍 Ikeja Computer Village</span>
                  <span>·</span>
                  <span>Balogun Market</span>
                  <span>·</span>
                  <span>Yaba Thrift Hubs</span>
                  <span>·</span>
                  <span>Aba Shoe Districts</span>
                </div>
              </div>

              {/* Right Column: Dynamic Live Queue & 1-Tap Action Anchor */}
              <div className="lg:col-span-5">
                <HeroVisualAnchor />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 2 — THE PROBLEM (Lagos Social Commerce Reality)
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 border-t border-surface-border">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-12 space-y-3">
              <p className="editorial-kicker text-accent">The Merchant Reality</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold leading-[1.08] text-text-primary">
                Every African social vendor knows this silent leak.
              </h2>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                You post new arrivals on Instagram or WhatsApp Status. 30 people message asking "How much?" You quote prices and send photos. Then walk-ins, waybill packages, and bank alerts take over.
              </p>
            </div>

            {/* Contrast Block: Human Conversation → Structured Opportunity → Sabi Action */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-surface rounded-2xl border border-surface-border p-6 space-y-4 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted px-2.5 py-1 rounded bg-surface-2 border border-surface-border">
                  Stage 01 · Inquiry
                </span>
                <h3 className="text-lg font-bold text-text-primary">Customer asks price</h3>
                <div className="p-3.5 rounded-lg bg-surface-2 border border-surface-border">
                  <p className="text-xs text-text-primary italic leading-relaxed">
                    "Boss, is the refurbished iPhone 13 still available? Can you hold it for me to pick up at Computer Village this afternoon?"
                  </p>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  The buyer is genuinely interested and ready to pay. You send price and account details.
                </p>
              </div>

              <div className="bg-surface rounded-2xl border border-surface-border p-6 space-y-4 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent px-2.5 py-1 rounded bg-accent/10 border border-accent/30">
                  Stage 02 · Silence
                </span>
                <h3 className="text-lg font-bold text-text-primary">You get busy</h3>
                <div className="p-3.5 rounded-lg bg-surface-2 border border-surface-border">
                  <p className="font-mono text-xs text-accent font-bold">
                    47 NEW MESSAGES ARRIVE
                  </p>
                  <p className="font-mono text-[11px] text-text-muted mt-1">
                    Customer chat scrolls down past the fold.
                  </p>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  You attend to shop walk-ins, waybill packages, and check bank transfers. The chat is completely forgotten.
                </p>
              </div>

              <div className="bg-surface rounded-2xl border border-danger/30 p-6 space-y-4 shadow-sm">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-danger px-2.5 py-1 rounded bg-danger/10 border border-danger/30">
                  Stage 03 · Lost Sale
                </span>
                <h3 className="text-lg font-bold text-text-primary">Money disappears</h3>
                <div className="p-3.5 rounded-lg bg-surface-2 border border-surface-border">
                  <p className="font-mono text-xs text-danger font-bold">
                    ₦420,000 SALE LOST
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Customer assumed you sold it to someone else and bought down the street.
                  </p>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  They didn't say no. They just needed a polite follow-up reminder.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 3 — HOW IT WORKS (With Live Chat-to-Card Magic)
        ═══════════════════════════════════════════════════ */}
        <HowItWorks />

        {/* ═══════════════════════════════════════════════════
            SECTION 4 — INTERACTIVE MULTI-VERTICAL SIMULATOR
        ═══════════════════════════════════════════════════ */}
        <ChatSimulator />

        {/* ═══════════════════════════════════════════════════
            SECTION 5 — REAL PRODUCT INTERFACE
        ═══════════════════════════════════════════════════ */}
        <ProductScreenshots />

        {/* ═══════════════════════════════════════════════════
            SECTION 6 — OPPORTUNITY CALCULATOR
        ═══════════════════════════════════════════════════ */}
        <OpportunityCalculator />

        {/* ═══════════════════════════════════════════════════
            SECTION 7 — TRUST & PRIVACY ARCHITECTURE
        ═══════════════════════════════════════════════════ */}
        <TrustSection />

        {/* ═══════════════════════════════════════════════════
            SECTION 8 — FAQ
        ═══════════════════════════════════════════════════ */}
        <FAQSection />

        {/* ═══════════════════════════════════════════════════
            SECTION 9 — FINAL ACTION CALLOUT
        ═══════════════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-surface-border">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-surface-border">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-accent uppercase tracking-wider">
                Start in 30 Seconds
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-[1.06] text-text-primary max-w-2xl mx-auto">
              Never lose another customer in your WhatsApp chats.
            </h2>

            <p className="text-base sm:text-lg text-text-muted max-w-lg mx-auto">
              Start recovering forgotten sales today. No app download. No credit card. Works directly in your mobile browser.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/auth"
                onClick={() => trackEvent('start_free_click', { source: 'final_cta' })}
                className="w-full sm:w-auto bg-accent text-white dark:text-background font-extrabold py-4 px-8 rounded-xl text-base flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_4px_30px_rgba(217,119,6,0.25)]"
              >
                <span>Start Free — 15 Free Deal Slots</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="w-full sm:w-auto py-4 px-6 rounded-xl border border-surface-border text-text-muted hover:text-text-primary hover:border-accent text-base font-bold transition-all"
              >
                Compare Free vs Pro Tier
              </Link>
            </div>

            <p className="font-mono text-xs text-text-muted">
              ₦0 to start · Free plan includes 15 active deal slots · 100% Ban Safe
            </p>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-surface-border pt-12 pb-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-display font-extrabold text-accent">sabi</span>
                <span className="font-mono text-[10px] text-text-muted">· African Social Commerce Utility</span>
              </div>
              <p className="text-xs text-text-muted mt-1">
                Built specifically for African vendors who sell through WhatsApp and Instagram.
              </p>
            </div>

            <div className="flex flex-col sm:items-end text-xs text-text-muted space-y-1 font-mono">
              <p>Sabi is not affiliated with WhatsApp or Meta Inc.</p>
              <p>© {new Date().getFullYear()} Sabi. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* ─── Sticky Mobile CTA ─── */}
      {showStickyBar && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          className="fixed bottom-0 left-0 right-0 z-50 glass safe-p-bottom px-4 py-3 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
        >
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-text-primary">15 Free Slots</span>
              <span className="text-[9px] font-mono text-accent-whatsapp">No Meta Connection</span>
            </div>
            <Link
              to="/auth"
              onClick={() => trackEvent('start_free_click', { source: 'sticky_bar' })}
              className="flex-1 flex items-center justify-center gap-1.5 bg-accent text-white dark:text-background font-extrabold py-3 px-4 rounded-xl text-xs active:scale-[0.98] transition-all shadow-md"
            >
              <span>Start Free — Open Sabi</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Landing
