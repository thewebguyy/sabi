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
  <div className="border-b border-surface-border last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-lg"
      aria-expanded={isOpen}
    >
      <span className="text-sm font-bold text-text-primary pr-4 group-hover:text-accent transition-colors">
        {question}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="shrink-0"
      >
        <ChevronDown size={18} className="text-text-muted" />
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
          <p className="text-xs text-text-muted leading-relaxed pb-4">
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

const faqs: Array<{ question: string; answer: string }> = [
  {
    question: 'Do I need to download an app?',
    answer: 'No. Sabi is a web app that runs in your phone\'s browser — Chrome, Safari, or any browser you use. You can add it to your home screen for quick access, but there\'s nothing to install from any app store.',
  },
  {
    question: 'How does Sabi know which conversations to remind me about?',
    answer: 'You share or paste the conversation. Sabi extracts the customer name, product, and amount from the chat text. When the deal goes quiet — no response for a set period — you get a reminder with a follow-up message ready to send.',
  },
  {
    question: 'Can Sabi read my WhatsApp directly?',
    answer: 'No. Sabi cannot access your WhatsApp account or read your messages. You manually share or paste conversations you want to track. Sabi only sees the text you choose to share with it.',
  },
  {
    question: 'Is this free?',
    answer: 'Yes. Start free with no credit card required. You can track your first deals, get follow-up reminders, and see the value immediately. Upgrade later if you need more capacity.',
  },
  {
    question: 'Will my customers know I\'m using Sabi?',
    answer: 'No. Sabi works behind the scenes. When you follow up, it opens your normal WhatsApp with a suggested message — the customer sees a regular WhatsApp message from you, nothing else.',
  },
  {
    question: 'How is my data protected?',
    answer: 'Sabi does not store raw chat logs. Conversations are processed to extract deal information (name, product, amount), then the raw text is discarded. Your customer data is never sold or shared with third parties.',
  },
]

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 px-6" id="faq">
      <div className="max-w-md mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-3">
          FAQ
        </p>
        <h2 className="text-2xl font-display font-extrabold mb-8 leading-tight">
          Common questions
        </h2>

        <div className="bg-surface rounded-3xl border border-surface-border px-5">
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
