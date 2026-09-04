import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, MessageSquareWarning, Clock, Banknote } from 'lucide-react'
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
      // Show sticky bar after scrolling past the hero CTA
      const scrollY = window.scrollY
      setShowStickyBar(scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-primary font-body overflow-x-hidden">
      {/* ─── Top Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-2xl font-display font-extrabold text-accent leading-none">sabi</span>
          <span className="text-[8px] text-text-muted font-medium tracking-widest uppercase">
            you sabi your business
          </span>
        </div>
        <Link
          to="/auth"
          className="px-4 py-1.5 border border-accent text-accent rounded-full text-sm font-bold hover:bg-accent hover:text-background transition-all"
        >
          Start Free
        </Link>
      </nav>

      <main className="pt-24 pb-20">
        {/* ═══════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════ */}
        <section className="px-6 mb-20">
          <div className="max-w-md mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[36px] sm:text-[42px] font-display font-extrabold leading-[1.08] mb-6"
            >
              You sell on WhatsApp.{' '}
              <span className="text-text-muted">The chat gets buried.</span>{' '}
              <span className="text-text-muted">The customer gets </span>
              <span className="text-accent">forgotten.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-text-muted mb-10 leading-relaxed"
            >
              Sabi helps you remember the customers who could still become money.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/auth"
                className="group flex items-center justify-center gap-2 w-full bg-accent text-background font-extrabold py-4 rounded-xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,176,32,0.25)]"
              >
                Start Free — No Download Needed
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-center text-text-muted text-[13px] mt-4">
                ₦0 to start. No credit card. Runs in your browser.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 2 — THE PROBLEM
        ═══════════════════════════════════════════════════ */}
        <section className="px-6 mb-4">
          <div className="max-w-md mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-3">
              The problem
            </p>
            <h2 className="text-2xl font-display font-extrabold mb-8 leading-tight">
              Every vendor knows this feeling.
            </h2>

            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-surface rounded-2xl border border-surface-border p-5 flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-2xl bg-accent-whatsapp/10 border border-accent-whatsapp/20 flex items-center justify-center shrink-0">
                  <MessageSquareWarning size={20} className="text-accent-whatsapp" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">Customer asks</h3>
                  <p className="text-xs text-text-muted leading-relaxed italic">
                    "Hi, is the burgundy lace still available? How much?"
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-surface rounded-2xl border border-surface-border p-5 flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-2xl bg-surface-2 border border-white/5 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-text-muted" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">You get busy</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    47 new messages. The chat scrolls away. You forget.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-surface rounded-2xl border border-danger/10 p-5 flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center shrink-0">
                  <Banknote size={20} className="text-danger" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">Money disappears</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    That was a ₦65,000 sale. The customer went elsewhere. Gone.
                  </p>
                </div>
              </motion.div>
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
            SECTION 5 — REAL PRODUCT SCREENSHOTS
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
            SECTION 9 — FINAL CTA
        ═══════════════════════════════════════════════════ */}
        <section className="py-16 px-6" id="final-cta">
          <div className="max-w-md mx-auto text-center space-y-6">
            <h2 className="text-3xl font-display font-extrabold leading-tight">
              Start recovering<br />
              <span className="text-accent">forgotten opportunities</span>
            </h2>
            <Link
              to="/auth"
              className="group inline-flex items-center justify-center gap-2 w-full bg-accent text-background font-extrabold py-4 rounded-xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,176,32,0.25)]"
            >
              Start Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-text-muted text-sm">
              No credit card. No download. Takes 30 seconds.
            </p>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="text-center text-text-muted text-[11px] leading-relaxed px-6 pt-8 pb-6 border-t border-surface-border mt-8">
          <p className="mb-2">Sabi is not affiliated with WhatsApp or Meta.</p>
          <p>© {new Date().getFullYear()} Sabi. Built for African vendors.</p>
        </footer>
      </main>

      {/* ─── Sticky Mobile CTA ─── */}
      {showStickyBar && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 glass safe-p-bottom px-4 py-3 lg:hidden border-t border-white/5"
        >
          <Link
            to="/auth"
            className="flex items-center justify-center gap-2 w-full bg-accent text-background font-extrabold py-3 rounded-xl text-sm active:scale-[0.98] transition-all"
          >
            Start Free
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default Landing
