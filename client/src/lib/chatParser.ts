/**
 * Sabi WhatsApp Chat Parser & Deadline Engine
 * 
 * Local, on-device parsing for Nigerian social commerce conversations.
 * Zero-cloud storage of raw conversation texts.
 */

export interface ParsedDealResult {
  customerName: string;
  customerPhone: string;
  productName: string;
  amount: number;
  constraint: string;
  followUpDueHours: number; // calculated hours until follow-up (e.g. 24h, 48h, or specific deadline)
  isAmountAmbiguous: boolean;
  confidenceScore: number; // 0 to 1
}

/**
 * Parses raw WhatsApp / Instagram chat text.
 */
export function parseNigerianChat(rawText: string): ParsedDealResult {
  const text = (rawText || '').trim();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Phone extraction
  let detectedPhone = '';
  const phoneMatch = text.match(/(?:\+234|0)(?:70|80|81|90|91)\d{8}/);
  if (phoneMatch) {
    detectedPhone = phoneMatch[0];
  }

  // 2. Amount extraction
  let parsedAmount = 0;
  let isAmountAmbiguous = false;

  // Check explicit currency symbol first: ₦60,000 or N60,000 or NGN 60,000
  const nairaMatch = text.match(/(?:₦|NGN|\bN\s*)([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{2,7})/i);
  // Check 'k' or 'thousand' shorthand: 60k, 185k
  const kMatch = text.match(/\b([0-9]{1,4})\s*(?:k|thousand)\b/i);
  // Check plain numbers that look like prices (e.g. "it is 45000")
  const priceContextMatch = text.match(/(?:price|cost|pay|transfer|total|amount|for)\s*(?:is|of|:)?\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{4,7})/i);

  if (nairaMatch) {
    parsedAmount = parseFloat(nairaMatch[1].replace(/,/g, '')) || 0;
  } else if (kMatch) {
    parsedAmount = (parseFloat(kMatch[1]) || 0) * 1000;
  } else if (priceContextMatch) {
    parsedAmount = parseFloat(priceContextMatch[1].replace(/,/g, '')) || 0;
  }

  if (parsedAmount <= 0) {
    isAmountAmbiguous = true;
  }

  // 3. Customer name extraction
  let detectedName = '';
  for (const line of lines) {
    const chatMatch = line.match(/(?:\[?\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?\]?|\d{1,2}\/\d{1,2}\/\d{2,4}.*?[-:]\s*)([^:]{2,25}):/i);
    if (chatMatch) {
      const candidate = chatMatch[1].trim();
      if (!/^(you|me|vendor|admin|seller|sabi|owner)$/i.test(candidate)) {
        detectedName = candidate;
        break;
      }
    }
  }

  if (!detectedName) {
    const colonMatch = lines[0]?.match(/^([^:]{2,20}):/);
    if (colonMatch && !/^(you|me|vendor|admin|seller)$/i.test(colonMatch[1].trim())) {
      detectedName = colonMatch[1].trim();
    } else {
      const firstLine = lines[0] || 'WhatsApp Customer';
      detectedName = firstLine.length > 25 ? 'WhatsApp Customer' : firstLine;
    }
  }

  // 4. Constraint and Location extraction
  let detectedConstraint = '';
  const constraintKeywords = text.match(/(?:deliver(?:y)? to|waybill to|dispatch to|pickup at|hold till|send to|bring to|drop at)\s+([^,.\n]+)/i);
  if (constraintKeywords) {
    detectedConstraint = constraintKeywords[0].trim();
  }

  // 5. Product name extraction
  let detectedProduct = '';
  const merchandiseMatch = text.match(/(?:for the|about the|on the|price of|buy|order|interested in)\s+([^?!\n.,]{3,40})/i);
  if (merchandiseMatch) {
    detectedProduct = merchandiseMatch[1].trim();
  } else {
    // Find line that doesn't look like sender name or timestamp
    const productCandidate = lines.find(l => l.length > 4 && !l.includes(detectedName) && !l.match(/^\d{1,2}\/\d{1,2}/));
    detectedProduct = productCandidate ? productCandidate.slice(0, 40) : 'Inquired Item';
  }

  // 6. Explicit Customer Deadlines & Timing Analysis
  // If customer says "tomorrow", "today", "by 4pm", "by friday", prioritize urgency
  let followUpDueHours = 48; // default silence window
  const lowerText = text.toLowerCase();

  if (lowerText.includes('today') || lowerText.match(/\bby\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/)) {
    followUpDueHours = 6; // urgent same-day follow-up
  } else if (lowerText.includes('tomorrow') || lowerText.includes('next day')) {
    followUpDueHours = 24; // tomorrow deadline
  } else if (lowerText.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/)) {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = new Date().getDay();
    const matchedDay = lowerText.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/)?.[1];
    if (matchedDay) {
      const targetDay = daysOfWeek.indexOf(matchedDay);
      if (targetDay !== -1) {
        let diffDays = (targetDay - currentDay + 7) % 7;
        if (diffDays === 0) diffDays = 7;
        followUpDueHours = Math.max(12, diffDays * 24 - 12); // Nudge before deadline day
      }
    }
  }

  // Calculate confidence
  let confidenceScore = 0.5;
  if (detectedName && detectedName !== 'WhatsApp Customer') confidenceScore += 0.2;
  if (parsedAmount > 0) confidenceScore += 0.2;
  if (detectedPhone) confidenceScore += 0.1;

  return {
    customerName: detectedName,
    customerPhone: detectedPhone,
    productName: detectedProduct,
    amount: parsedAmount,
    constraint: detectedConstraint,
    followUpDueHours,
    isAmountAmbiguous,
    confidenceScore: Math.min(1, confidenceScore)
  };
}
