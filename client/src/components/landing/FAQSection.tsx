import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-[#1F2521] last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 text-left group focus:outline-none"
      aria-expanded={isOpen}
    >
      <span className="text-base sm:text-lg font-bold text-text-primary pr-6 group-hover:text-accent transition-colors">
        {question}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="shrink-0 text-text-muted group-hover:text-accent"
      >
        <ChevronDown size={18} />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <p className="text-sm text-text-muted leading-relaxed pb-5">
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

const faqs: Array<{ question: string; answer: string }> = [
  {
    question: 'Do I have to connect my WhatsApp account or scan a QR code?',
    answer:
      'No. You do not connect your WhatsApp account or share login credentials. You simply copy and paste the chat conversation or text into Sabi. This protects your WhatsApp from any risk of ban or suspension.',
  },
  {
    question: 'Do I need to download an app from Play Store or App Store?',
    answer:
      'No download required. Sabi is a fast web application that runs directly in Safari, Chrome, or any mobile browser. You can tap "Add to Home Screen" to use it just like a native app without taking up phone storage.',
  },
  {
    question: 'Will Sabi ever message my customers automatically?',
    answer:
      'Never. Sabi does not send messages behind your back. It prepares a polite, context-rich follow-up draft and opens your real WhatsApp with the message ready. You review it and hit Send yourself.',
  },
  {
    question: 'How does Sabi know which customer needs attention?',
    answer:
      'When you paste a deal, Sabi notes the date and price agreed. If 48 hours pass without payment or reply, Sabi brings that deal to the top of your Today queue so you can revive the sale before it goes cold.',
  },
  {
    question: 'Is it free to start?',
    answer:
      'Yes. You can start completely free with ₦0 and no credit card required. Track your first 15 active deals, get reminder alerts, and test how many lost sales you recover before deciding to upgrade.',
  },
]

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 px-6 border-t border-[#1C221E]" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 space-y-3">
          <p className="editorial-kicker text-accent">Questions & Answers</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold leading-[1.08] text-text-primary">
            Frequently asked questions
          </h2>
          <p className="text-base text-text-muted">
            Direct answers to common questions about using Sabi for your business.
          </p>
        </div>

        <div className="bg-[#121513] rounded-2xl border border-[#232B25] px-6 sm:px-8">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
