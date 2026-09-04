/**
 * Lightweight Conversion Analytics for Sabi Public Website
 * Privacy-first, zero third-party dependencies, tracks core activation funnel:
 * visitor -> vendor -> first captured opportunity -> first follow-up
 */

export type AnalyticsEvent =
  | 'landing_view'
  | 'start_free_click'
  | 'pricing_view'
  | 'simulator_interaction'
  | 'simulator_followup_click'
  | 'calculator_interaction'
  | 'faq_open'
  | 'product_screenshot_interaction'
  | 'auth_started'
  | 'auth_completed'
  | 'first_capture'
  | 'first_deal_created'
  | 'first_followup'

interface EventPayload {
  [key: string]: string | number | boolean | undefined
}

const STORAGE_KEY = 'sabi_telemetry_events'

export const trackEvent = (event: AnalyticsEvent, payload?: EventPayload): void => {
  try {
    const timestamp = new Date().toISOString()
    const entry = {
      event,
      timestamp,
      payload: payload || {},
    }

    // Keep lightweight session trail for debugging & funnel validation
    const existing = sessionStorage.getItem(STORAGE_KEY)
    const list = existing ? JSON.parse(existing) : []
    list.push(entry)
    // Cap at 100 events
    if (list.length > 100) list.shift()
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))

    // In dev / audit mode, log cleanly
    if (import.meta.env.DEV) {
      console.log(`[Sabi Analytics] ${event}`, payload || '')
    }
  } catch {
    // Fail silently without blocking UI
  }
}
