# SABI — OPERATING MANUAL
*Founder Constitution + Concierge MVP System*

---

## PART I — THE VERDICT

**Independent assessment.** The problem — vendors losing money because a hot conversation goes cold and gets buried under 200 other chats — is real and common in high-volume social commerce. That much doesn't need validating; it's a known behavior pattern in chat-based selling everywhere. What's unvalidated is everything downstream of "this is annoying": whether it's annoying *enough* to change behavior, whether vendors will do the extra work of sending you conversations, and whether a reminder + drafted message actually converts inactive chats into money.

**What I agree with:** Killing the "WhatsApp CRM" framing was correct. CRM implies admin work, and admin work is exactly what an overloaded solo vendor won't adopt. "Memory + nudge" is a much thinner, more honest promise, and thin promises are easier to keep manually, which is exactly what a concierge MVP needs. The instinct to run this manually before writing code is correct and should not be second-guessed.

**What I disagree with, or think you're underweighting:**
- The beachhead hypothesis (fashion/beauty) is stated with more confidence than the doc's own evidence supports. You have no data yet that this segment forgets follow-ups more than food vendors, electronics resellers, or service providers — you have a plausible story. Treat it as one of several equally-likely candidates until vendors tell you otherwise.
- "Android Share Target" is being treated as a capture *mechanism* when it's really a capture *cost*. The real question isn't "does the share sheet work" (it does, technically) — it's "will a busy vendor interrupt their sales flow to share a chat to an app they just met." That's a behavioral question, not a technical one, and Part VIII below is scoped accordingly.
- The document assumes the bottleneck is *remembering*. There's a real chance the bottleneck is *capacity* — some vendors know exactly who they forgot, they just don't have time to write a good follow-up message or don't know what to say. If that's the real problem, "we'll remind you" undersells the product; "we'll write the message for you" might be the actual value. Your concierge experiment should specifically instrument for this distinction (see Part V).

**Biggest remaining uncertainty:** Whether vendors will *repeatedly* send you conversations without being asked, without a product, and without payment. Everything else (extraction accuracy, follow-up quality, revenue recovered) is downstream of this one behavior. If this doesn't happen at least 3-4 times per vendor across 7 days, nothing else in the plan matters.

**The single most important experiment:** Get 10 vendors to voluntarily send you a second conversation without a reminder from you. That one behavior — unprompted repeat submission — is the strongest cheap signal you can get in a week that this is a felt, recurring problem rather than a one-time "sure, why not" favor to a friend.

---

## PART II — SABI FOUNDER CONSTITUTION

**1. Mission.** Stop social-commerce vendors from losing money because a paying customer got lost in the chat list.

**2. Product thesis.** Conversational commerce generates more buying intent than vendors can track manually. A system that remembers open opportunities and prompts timely, contextual follow-up will recover revenue vendors are currently leaving on the table.

**3. Customer.** A solo or small-team vendor who sells primarily through WhatsApp/Instagram DMs, personally handles the conversations, and has enough volume that some deals fall through the cracks.

**4. Problem.** Buying-intent conversations go inactive and are never revisited, either because the vendor forgot, ran out of time, or didn't know how to reopen the conversation without sounding pushy.

**5. Promise.** "We'll tell you which conversation needs your attention today, and hand you the message to send."

**6. Core loop.** Conversation → Capture → Sabi understands it → Deal enters memory → Customer goes quiet → Sabi flags it → Sabi drafts follow-up → Vendor sends it → Outcome recorded.

**7. Non-negotiable principles.**
- Revenue recovered is the only metric that ultimately matters; everything else is a leading indicator.
- The vendor must never feel like they've taken on an admin job. If using Sabi feels like data entry, the product has failed regardless of what it technically does.
- User behavior overrides user opinion, every time, without exception — including when the founder likes an idea a vendor didn't act on.
- Manual before automated. Nothing gets built in software until it's been done by hand and proven worth automating.
- Simple before intelligent. A dumb reminder that fires reliably beats a smart one that's wrong sometimes.
- Trust is the product's real currency — one bad or robotic follow-up message can burn a vendor's relationship with a customer, and Sabi's credibility with the vendor, in one shot.
- No infrastructure before demonstrated demand — no CRM features, no dashboards, no integrations "just in case."

**8. Product boundaries.** Sabi is not a CRM, not inventory software, not a storefront, not a payment processor, not a WhatsApp replacement, not an ERP, not a general AI assistant. It does one thing: catches forgotten sales opportunities and helps close them.

**9. Decision filter.** See Part III of the constitution below (Section 23 source) — every proposed feature must pass it before it's discussed further.

**10. Metrics hierarchy.** Opinion < Intent < Behavior < Repeated behavior < Economic outcome. Only the top two tiers count as validation; everything below is context.

---

## PART III — DECISION FILTER FOR EVERY FUTURE FEATURE

Before building anything, answer all five. A feature needs a clear "yes" on at least one, and no clear "no" on any:

1. Does it reduce the friction of getting a conversation into Sabi?
2. Does it improve Sabi's ability to correctly identify an opportunity that needs attention?
3. Does it improve the quality or timing of the follow-up?
4. Does it increase the odds that a flagged opportunity turns into actual revenue?
5. Does it make the vendor more likely to come back and use Sabi again tomorrow?

If a feature only makes Sabi *look* more sophisticated, more "platform-like," or more fundable — reject it. Sophistication is a later-stage luxury, not a validation-stage requirement.

---

## PART IV — EVIDENCE HIERARCHY

- **Level 0 — Opinion** ("this is a great idea"). Nearly worthless; people are polite and pattern-match to things they've heard pitched before.
- **Level 1 — Intent** ("I would use this"). Slightly better, but intent is cheap to state and expensive to act on; people routinely overestimate their own future behavior.
- **Level 2 — Behavior** (they actually send you a conversation once). This is the first real signal — it cost them something (time, mild awkwardness, exposing customer data).
- **Level 3 — Repeated behavior** (they come back and do it again, unprompted). This is the strongest pre-revenue signal you can get — it means the problem recurred in their head without you reminding them.
- **Level 4 — Economic outcome** (a follow-up you drafted led to a closed sale, and ideally the vendor volunteers "how much would this cost"). This is proof, not signal.

Design every part of the concierge experiment to push you toward capturing Level 2–4 evidence, and be suspicious of any conclusion resting only on Level 0–1.

---

## PART V — CONCIERGE MVP

**Objective:** Manually operate as "Sabi" for 10-20 vendors over 7 days to find out whether forgotten-follow-up revenue is painful, frequent, and recoverable enough to justify building software.

**Hypothesis being tested:** Vendors who sell through WhatsApp/Instagram DMs will (a) repeatedly and voluntarily share buying-intent conversations with a human-run "Sabi," (b) act on the follow-up recommendations they're given, and (c) recover revenue they would not have recovered otherwise.

### Recruitment criteria
Qualifies:
- Sells actively via WhatsApp and/or Instagram DMs, personally handling conversations
- Gets inbound inquiries at least a few times a day
- Has an average transaction value worth remembering (a rough floor: ₦5,000+, adjust per category)
- Has had at least one recent experience of "a customer went quiet and I never followed up"
- Can respond to you reliably for 7 days (won't travel, won't go offline)

Disqualifies:
- Delegates all customer chats to staff (you want the person who feels the pain directly)
- Runs a storefront/checkout flow with no negotiation step (nothing to "remember" — it's already transactional)
- Extremely low volume (fewer than ~5 inbound inquiries a week) — not enough data points in 7 days

**Scoring (quick 0-2 each, recruit 6+):** conversation volume, avg. transaction value, negotiation frequency, recent "forgot to follow up" story, availability/responsiveness during the window, personal ownership of chats.

### Recruitment scripts
Keep these short, problem-first, no product pitch, no promises.

*Instagram DM:*
"Hey! Quick one — do you ever have a customer ask the price, go quiet, and then you just... lose track of them in your DMs? I'm looking into this for a few days, would love to hear how you currently handle it if you have 2 mins."

*WhatsApp:*
"Hi [name], random question — with all the customer chats you get, do some just fall through the cracks after they ask for price/details? Trying to understand how vendors deal with that. Got a minute this week to chat?"

*Personal referral:*
"I'm looking into a problem a lot of people selling on WhatsApp/IG have — losing track of customers who went quiet mid-conversation. Do you know anyone who sells actively there who'd be open to a quick chat about how they currently handle follow-ups?"

*In-person:*
"Can I ask you something about how you sell on WhatsApp? Do customers ever ask for price and then just disappear on you? How do you keep track of who to follow up with?"

### Onboarding script (what to say)
"For the next week, I want to help you catch customers who went quiet before buying. Whenever you have a conversation where someone showed real interest but didn't follow through, send it to me — screenshot or copy the text, and take out anything you don't want me to see like phone numbers if you'd rather. I'll look at it, tell you if and when I think you should follow up, and give you the exact message to send. You just copy-paste it in. This is a manual experiment, not a finished product — there's no cost, no commitment, and I just want to see if this is actually useful before I build anything real."

**What NOT to say:** don't mention AI, don't mention "startup," don't say "CRM," don't promise it will make them money, don't tell them what results you expect — any of that will bias what they submit and how they respond.

### Conversation submission
Ask for a screenshot or pasted text of the relevant portion of the chat (not the whole history). Tell them to redact anything sensitive (phone numbers, addresses, payment info) they're not comfortable sharing — you only need the parts that show product, price, and where it stalled.

### Manual extraction — fields to record
Customer (first name or alias), product/service, quoted amount, currency, deal stage, customer intent (browsing / negotiating / ready-to-pay / requested payment info), last message date, what they said last, recommended next action, urgency level.

### Deal stage definitions
- **Open** — inquiry made, no price discussed yet
- **Negotiating** — price/terms being discussed
- **Waiting payment** — customer asked for payment details or said they'd pay
- **Inactive** — no response for longer than the category's normal reply window
- **Won** — payment/sale confirmed
- **Lost** — customer explicitly declined or went permanently unresponsive after follow-up

### Follow-up timing
Default: flag as "needs attention" once inactive for 48 hours for high-intent stages (waiting payment, negotiating), 5 days for lower-intent stages (open). Adjust per vendor based on their own typical response cadence — ask them what "normal" looks like for their customers during onboarding.

### Message generation (manual)
Keep it short, reference the specific product/price discussed, low-pressure tone, one clear next step (confirm size/color, confirm payment, ask if still interested). Never sound like a script — vary phrasing per vendor and situation.

### Follow-up tracking
Log: date sent, exact message, whether vendor actually sent it verbatim or edited it, customer response (yes/no/none), time to response.

### Outcome tracking
Log: sale closed (Y/N), revenue amount, days from flag to close, vendor's own account of what worked or didn't.

---

## PART VI — MONEY AT RISK: DEFINITION

Do not sum every inquiry into a headline number — that's fake precision and will destroy trust the first time a vendor checks the math.

- **Open opportunity** — any inquiry with a stated or implied price, regardless of activity status. Track but don't report as "at risk."
- **Needs attention** — an open opportunity that has crossed the inactivity threshold for its stage (see timing rules above).
- **Revenue at risk** — a "needs attention" opportunity in negotiating or waiting-payment stage specifically (i.e., a real price was actually discussed, not just asked about). Only this tier should ever be shown to a vendor as a number.

---

## PART VII — 7-DAY OPERATING PLAN

**Day 1 — Recruit + onboard.** Send 30-40 outreach messages. Onboard the first 5-8 who respond. Goal: 5+ vendors onboarded, 2+ conversations submitted by end of day.

**Day 2 — Process + first follow-ups.** Extract every submitted conversation. Identify anything already crossing the inactivity threshold and get the first follow-up messages out through vendors. Continue recruiting to reach 10+ total. Metric: # conversations submitted, # follow-ups sent.

**Day 3 — Track responses + recruit remainder.** Check which follow-ups got customer replies. Interview 2-3 vendors briefly about their experience so far (use Part VIII questions). Metric: response rate on follow-ups sent.

**Day 4 — Midpoint check.** Look specifically for unprompted repeat submissions — vendors sending a *second* conversation without you asking. This is your Day 4 gate: if almost nobody has done this, start planning a pivot conversation for Day 6-7 rather than waiting to the end.

**Day 5 — Deepen + observe.** Keep processing new submissions and follow-ups. Interview any vendor who has had a follow-up succeed or fail — get their unfiltered reaction.

**Day 6 — Push for outcomes.** Chase down every "waiting payment" and "negotiating" deal that's still open. Confirm outcomes (won/lost) wherever possible.

**Day 7 — Close + debrief.** Final data pull. Ask every active vendor directly: "Do you want to keep doing this next week?" and "Would you ever pay for this?" — don't lead them, just ask and record verbatim. Compile metrics against the gate criteria in Part IX.

---

## PART VIII — CUSTOMER RESEARCH

**Interview guide (behavioral, not opinion-seeking):**
- Tell me about the last customer who asked for a price and then disappeared. What happened?
- How many chats do you usually have going at once?
- How do you currently keep track of who you need to follow up with?
- Have you ever forgotten to follow up with someone? How often does that happen, roughly?
- Thinking of a specific time that happened — what was the deal worth?
- Do you use chat labels, notes, or a spreadsheet for this today?
- When a customer says "I'll get back to you," what do you actually do next?
- What happens after two days of silence? After a week?
- This week, when I flagged something for you — what made you send the message, or not send it?
- If this stopped tomorrow, would you miss it, or wouldn't you notice?

**Strong signals:** unprompted repeat submissions, vendor edits your draft message to make it more personal (shows investment, not disengagement), vendor asks proactively "did you check my chats today?", vendor asks what it would cost.

**Weak signals:** vendor says "cool" but never sends a second conversation, vendor sends the follow-up message you drafted without reading it, vendor's enthusiasm is verbal only.

**Red flags:** vendor forgets they're in the experiment, vendor says it feels like extra work, vendor stops responding to your check-ins, vendor already has a system (labels, notes app) they clearly trust more than this process.

---

## PART IX — METRICS

- **Activation rate** = vendors who submit ≥1 conversation ÷ vendors onboarded
- **Capture frequency** = total conversations submitted ÷ number of active vendors
- **Follow-up adoption** = follow-ups actually sent by vendor ÷ follow-ups recommended
- **Response rate** = customer replies received ÷ follow-ups sent
- **Recovery rate** = deals won ÷ deals flagged as "revenue at risk"
- **Revenue recovered** = sum of deal values won that were flagged inactive before recovery
- **Repeat behavior rate** = vendors who submit a 2nd+ conversation unprompted ÷ activated vendors
- **Retention signal** = vendors who ask to continue past Day 7 ÷ active vendors at Day 7
- **Willingness to pay** = vendors who spontaneously ask about cost (count and quote them verbatim)

---

## PART X — DECISION GATES

**CONTINUE** if, by Day 7: at least 6 of 10+ vendors have activated, at least 4 have unprompted repeat-submitted, at least 50% of recommended follow-ups were actually sent, at least one real sale is attributable to a Sabi-flagged follow-up, and at least half of active vendors ask to keep going.

**PIVOT** if: vendors clearly feel the pain and describe it unprompted in interviews, but capture friction is too high (few submissions despite stated interest), or timing/segment is off — e.g., a different vertical or a different follow-up cadence keeps coming up in conversation. Pivot on the *mechanism* (how deals are captured, which segment, what stage triggers a flag), not on the underlying problem.

**KILL** if: fewer than 3 vendors ever submit a second conversation unprompted, follow-up adoption stays under ~25%, no vendor reports a recovered sale by Day 7, or more than half of interviewed vendors describe an existing solution (labels, sticky notes, memory) that they trust more than yours.

---

## PART XI — BIGGEST RISKS

| Risk | Assumption | How to test | Mitigation if it fails |
|---|---|---|---|
| Capture friction | Vendors will interrupt their flow to send a chat | Track submission rate Day 1-2 | Shrink the ask — accept even a one-line paste, not a full screenshot |
| Vendors don't care enough | Forgotten revenue feels painful in the moment, not abstractly | Interview questions in Part VIII | If pain is abstract, this is a Kill signal, not a fixable friction |
| Existing tools (WhatsApp labels) already solve it | Vendors don't already have a working memory system | Ask directly in onboarding/interview | If most already use labels effectively, segment or problem is wrong |
| AI extraction errors (later) | Not relevant yet — you're doing extraction manually | N/A during concierge phase | Defer entirely until concierge validates the loop |
| Follow-up messages feel robotic | A human-written message will read as more genuine than expected | Ask vendors if they edited your draft, and why | Let vendors freely edit; track edit rate as a data point, not a failure |
| Vendors don't return | The problem is one-off, not recurring, for most vendors | Day 4 repeat-submission gate | If confirmed, problem may be real but too infrequent to build a habit-forming product on |
| Revenue impact too small | Average recovered deal size doesn't justify vendor's effort | Track revenue recovered ÷ time spent by vendor | If recovered value is trivial versus effort, kill or pivot value prop |
| Privacy concerns | Vendors will be uncomfortable sharing customer chats | Watch for redaction requests, hesitation, or refusal during recruitment | Make redaction the default instruction, not an afterthought |

---

## PART XII — TECHNICAL VALIDATION (Android Share Target)

This is a later, small, isolated test — do not let it distract from the manual concierge work in Weeks 1-2. Goal: confirm the *mechanism* is reliable enough to eventually reduce capture friction, not to build the product.

**Test:** Install a bare-bones PWA with a Web Share Target manifest entry. From WhatsApp on Android, use native Share → select the PWA → confirm the shared text arrives intact and usable in the PWA. Repeat across at least 2 different Android devices/OS versions and both "share as text" and "share as image" paths (note: shared images won't arrive as usable text — flag this as a real limitation if vendors mostly want to share screenshots rather than copied text).

**Success condition:** Text-based shares arrive reliably and are legible; you know definitively whether screenshot-sharing needs OCR (a materially bigger technical lift) before you commit to that as the primary capture path.

---

## PART XIII — WHAT NOT TO BUILD YET

No CRM, no customer dashboard, no analytics, no inventory, no payments or payment verification, no staff accounts, no WhatsApp Business API integration, no automated messaging, no AI chatbot, no catalogue or storefront, no credit scoring, no lending, no complex notification system, no advanced reporting. If any of these feels tempting, run it through the Part III filter first — it almost certainly fails.

---

## PART XIV — POST-VALIDATION BUILD PLAN (only if CONTINUE)

**Phase 1 — Core loop:** Capture (manual paste/share) → AI-assisted extract → vendor confirms → save → today's flagged list → follow-up draft.

**Phase 2 — Retention:** Better reminder timing, refined follow-up quality, recovery tracking dashboard (still minimal).

**Phase 3 — Monetization:** Introduce pricing once willingness-to-pay signal is already strong from the concierge phase — don't discover pricing tolerance for the first time here.

**Phase 4 — Scale:** Only after Phase 1-3 are working with real paying vendors.

---

## PART XV — LONG-TERM COMPANY (speculation, clearly separated)

*What we build now:* a manual-then-lightly-automated tool that flags forgotten conversations and drafts follow-ups.

*What Sabi could become, IF the core loop proves valuable at scale:* an "intent ledger" for conversational commerce — a system that understands customer intent, product demand, and merchant conversion patterns across many vendors. That data exposure could eventually support adjacent products (better merchant tooling, payments, checkout, financing, credit, business intelligence). None of this is evidence-backed today, and none of it should influence what gets built in the next 30 days. It's a plausible future, not a current plan.

---

# THE NEXT 7 DAYS

1. **Tonight:** Build the outreach shortlist — aim for 40+ names/handles of vendors who plausibly qualify (fashion/beauty first, but don't exclude other categories if they're easy to reach).
2. **Tomorrow morning:** Send the first batch of recruitment DMs (Part V scripts). Set up the tracking spreadsheet (Part V fields + Part VI risk classification).
3. **Tomorrow, as replies come in:** Onboard using the exact script in Part V. Do not deviate or add product framing.
4. **Day 1 evening:** Process any conversations already submitted; extract manually using the defined fields.
5. **Day 2-3:** Keep recruiting until you hit 10+ active vendors; process every submission same-day; send follow-ups through vendors as soon as something crosses the inactivity threshold.
6. **Day 4:** Run the repeat-submission gate check — if it's weak, start drafting your pivot questions for the Day 5-6 interviews now, don't wait.
7. **Day 5-6:** Run the Part VIII interviews with every active vendor; chase outcomes on open deals.
8. **Day 7 morning:** Pull final numbers against Part X gates. Write the verdict — Continue, Pivot, or Kill — before you do anything else that day.
