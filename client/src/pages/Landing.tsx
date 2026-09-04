import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowRight, MessageCircle, Clock, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

import ChatSimulator from '../components/landing/ChatSimulator'
import HowItWorks from '../components/landing/HowItWorks'
import ProductScreenshots from '../components/landing/ProductScreenshots'
import OpportunityCalculator from '../components/landing/OpportunityCalculator'
import TrustSection from '../components/landing/TrustSection'
import FAQSection from '../components/landing/FAQSection'

const Landing: React.FC = () => {
  const [showStickyBar, setShowStickyBar] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0D0B] text-text-primary font-sans overflow-x-hidden selection:bg-accent selection:text-background">
      {/* ─── Top Editorial Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-baseline gap-3">
            <Link to="/" className="text-2xl sm:text-3xl font-display font-extrabold text-accent tracking-tight">
              sabi
            </Link>
            <span className="hidden sm:inline-block font-mono text-[10px] text-text-muted uppercase tracking-widest border-l border-[#242C26] pl-3">
              Lagos Commerce Utility
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-text-muted">
              <a href="#simulator" className="hover:text-text-primary transition-colors">
                Simulation
              </a>
              <a href="#how-it-works" className="hover:text-text-primary transition-colors">
                How It Works
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

            <Link
              to="/auth"
              className="px-4 sm:px-5 py-2 rounded-lg bg-accent text-background text-xs sm:text-sm font-extrabold hover:bg-accent/90 active:scale-[0.98] transition-all shadow-sm"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20">
        {/* ═══════════════════════════════════════════════════
            SECTION 1 — HERO (Editorial Asymmetric Composition)
        ═══════════════════════════════════════════════════ */}
        <section className="px-6 pt-4 pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Bold Editorial Statement */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161C18] border border-[#243027]">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-[11px] font-bold text-accent uppercase tracking-wider">
                    Commerce Memory for WhatsApp
                  </span>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-6xl lg:text-[68px] font-display font-extrabold leading-[1.04] text-text-primary tracking-tight"
                >
                  You sell on WhatsApp. <br />
                  <span className="text-text-muted">The chat gets buried.</span> <br />
                  <span className="text-text-muted">The customer gets </span>
                  <span className="text-accent">forgotten.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg sm:text-xl text-[#A6ADA8] max-w-xl leading-relaxed"
                >
                  Sabi helps you remember the customers who could still become money.
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
                      className="group flex-1 bg-accent text-background font-extrabold py-4 px-6 rounded-xl text-base flex items-center justify-center gap-2 hover:bg-[#ffba33] active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(255,176,32,0.25)]"
                    >
                      <span>Start Free — No Download Needed</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <p className="font-mono text-[11px] text-text-muted">
                    ₦0 to start. No credit card. Runs in any mobile browser.
                  </p>
                </motion.div>
              </div>

              {/* Right Column: Live Product Today Queue representation */}
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="bg-[#121513] rounded-2xl border border-[#232B25] p-5 shadow-2xl space-y-4"
                >
                  {/* Top instrumentation */}
                  <div className="flex justify-between items-start pb-3 border-b border-[#1F2521]">
                    <div>
                      <span className="editorial-kicker text-text-muted">TODAY'S AT-RISK MONEY</span>
                      <p className="font-mono text-3xl font-extrabold text-accent">₦385,000</p>
                    </div>
                    <span className="font-mono text-[10px] text-accent bg-[#1E1B0F] border border-accent/30 px-2.5 py-1 rounded">
                      4 CHATS QUIET
                    </span>
                  </div>

                  {/* High-priority deal card */}
                  <div className="bg-[#0A0D0B] rounded-xl border border-accent/40 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">Amaka O.</span>
                          <span className="font-mono text-[10px] bg-[#1F190D] text-accent px-2 py-0.5 rounded border border-accent/30 font-bold">
                            2 DAYS QUIET
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">Burgundy Lace (5 yards)</p>
                      </div>
                      <span className="font-mono text-sm font-bold text-accent">₦60,000</span>
                    </div>

                    <div className="bg-[#141815] rounded-lg p-3 border border-white/5 space-y-1">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted">
                        PRE-COMPOSED WHATSAPP MESSAGE
                      </p>
                      <p className="text-xs text-text-primary italic leading-relaxed">
                        "Good afternoon Amaka! Just checking in on the burgundy Swiss lace (5 yards) at ₦60,000. Another customer is asking about the bundle, but I kept it aside for you first..."
                      </p>
                    </div>

                    <Link
                      to="/auth"
                      className="w-full bg-[#25D366] text-[#0A0D0B] font-extrabold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-[#22c35e] transition-all"
                    >
                      <MessageCircle size={14} />
                      <span>Follow up with Amaka — ₦60,000</span>
                    </Link>
                  </div>

                  {/* Secondary quiet deals */}
                  <div className="space-y-2">
                    <div className="bg-[#0A0D0B] rounded-xl border border-[#1F2521] p-3 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-primary">Chidera K.</span>
                          <span className="font-mono text-[9px] text-text-muted">3 days quiet</span>
                        </div>
                        <p className="text-[11px] text-text-muted">Swiss Voile Bundle</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-accent">₦145,000</span>
                    </div>
                  </div>

                  <p className="text-center font-mono text-[10px] text-text-muted pt-1">
                    REALISTIC DEMONSTRATION · SABI TODAY SCREEN
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 2 — THE PROBLEM (Lagos Social Commerce Reality)
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-6 border-t border-[#1C221E]">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-12 space-y-3">
              <p className="editorial-kicker text-accent">The Merchant Reality</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold leading-[1.08] text-text-primary">
                Every African social vendor knows this silent leak.
              </h2>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                You post new arrivals on Instagram. 40 people message your WhatsApp asking "How much?" You quote prices and send photos. Then orders and dispatch calls take over.
              </p>
            </div>

            {/* Contrast Block: Human Conversation → Structured Opportunity → Sabi Action */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#121513] rounded-2xl border border-[#232B25] p-6 space-y-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted px-2.5 py-1 rounded bg-[#181D19] border border-[#242C26]">
                  Stage 01 · Inquiry
                </span>
                <h3 className="text-lg font-bold text-text-primary">Customer asks</h3>
                <div className="p-3.5 rounded-lg bg-[#0A0D0B] border border-white/5">
                  <p className="text-xs text-text-primary italic leading-relaxed">
                    "Sis, how much for 5 yards of the burgundy lace? Can you deliver to Lekki Phase 1 on Thursday?"
                  </p>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  The buyer is genuinely interested and ready to pay. You send price and account details.
                </p>
              </div>

              <div className="bg-[#121513] rounded-2xl border border-[#232B25] p-6 space-y-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent px-2.5 py-1 rounded bg-[#1E1B0F] border border-accent/30">
                  Stage 02 · Silence
                </span>
                <h3 className="text-lg font-bold text-text-primary">You get busy</h3>
                <div className="p-3.5 rounded-lg bg-[#0A0D0B] border border-white/5">
                  <p className="font-mono text-xs text-accent font-bold">
                    47 NEW MESSAGES ARRIVE
                  </p>
                  <p className="font-mono text-[11px] text-text-muted mt-1">
                    Customer chat scrolls down past the fold.
                  </p>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  You attend to walk-ins, waybill packages, and check bank alerts. The chat is completely forgotten.
                </p>
              </div>

              <div className="bg-[#121513] rounded-2xl border border-danger/30 p-6 space-y-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-danger px-2.5 py-1 rounded bg-[#210D0D] border border-danger/30">
                  Stage 03 · Lost Sale
                </span>
                <h3 className="text-lg font-bold text-text-primary">Money disappears</h3>
                <div className="p-3.5 rounded-lg bg-[#0A0D0B] border border-white/5">
                  <p className="font-mono text-xs text-danger font-bold">
                    ₦65,000 SALE LOST
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Customer assumed you sold out and bought elsewhere.
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
            SECTION 3 — INTERACTIVE SIMULATOR
        ═══════════════════════════════════════════════════ */}
        <ChatSimulator />

        {/* ═══════════════════════════════════════════════════
            SECTION 4 — HOW IT WORKS
        ═══════════════════════════════════════════════════ */}
        <HowItWorks />

        {/* ═══════════════════════════════════════════════════
            SECTION 5 — REAL PRODUCT INTERFACE
        ═══════════════════════════════════════════════════ */}
        <ProductScreenshots />

        {/* ═══════════════════════════════════════════════════
            SECTION 6 — OPPORTUNITY CALCULATOR
        ═══════════════════════════════════════════════════ */}
        <OpportunityCalculator />

        {/* ═══════════════════════════════════════════════════
            SECTION 7 — TRUST & PRIVACY
        ═══════════════════════════════════════════════════ */}
        <TrustSection />

        {/* ═══════════════════════════════════════════════════
            SECTION 8 — FAQ
        ═══════════════════════════════════════════════════ */}
        <FAQSection />

        {/* ═══════════════════════════════════════════════════
            SECTION 9 — FINAL ACTION CALLOUT
        ═══════════════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-[#1C221E]">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161C18] border border-[#243027]">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-accent uppercase tracking-wider">
                Start in 30 Seconds
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-[1.06] text-text-primary max-w-2xl mx-auto">
              Never lose another customer in your WhatsApp chats.
            </h2>

            <p className="text-base sm:text-lg text-text-muted max-w-lg mx-auto">
              Start recovering forgotten sales today. No app download. No credit card. Works in your browser.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/auth"
                className="w-full sm:w-auto bg-accent text-background font-extrabold py-4 px-8 rounded-xl text-base flex items-center justify-center gap-2 hover:bg-[#ffba33] active:scale-[0.98] transition-all shadow-[0_4px_30px_rgba(255,176,32,0.25)]"
              >
                <span>Start Free</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="w-full sm:w-auto py-4 px-6 rounded-xl border border-[#242C26] text-text-muted hover:text-text-primary hover:border-accent text-base font-bold transition-all"
              >
                Compare Free vs Paid
              </Link>
            </div>

            <p className="font-mono text-xs text-text-muted">
              ₦0 to start · Free plan includes 15 active deal slots
            </p>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-[#1C221E] pt-12 pb-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-display font-extrabold text-accent">sabi</span>
                <span className="font-mono text-[10px] text-text-muted">· Lagos Commerce Utility</span>
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
          className="fixed bottom-0 left-0 right-0 z-50 glass safe-p-bottom px-4 py-3 lg:hidden"
        >
          <Link
            to="/auth"
            className="flex items-center justify-center gap-2 w-full bg-accent text-background font-extrabold py-3.5 px-4 rounded-xl text-sm active:scale-[0.98] transition-all shadow-lg"
          >
            <span>Start Free — No Download Needed</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default Landing
