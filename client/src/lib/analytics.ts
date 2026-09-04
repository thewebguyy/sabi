/**
 * Lightweight Conversion & Activation Analytics for Sabi
 * Privacy-first, zero external tracker bloat.
 * Tracks the core activation funnel:
 * visitor -> start_free -> auth_completed -> first_capture -> first_deal_created -> first_followup -> deal_won
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
  | 'whatsapp_opened'
  | 'deal_won'
  | 'deal_lost'

export interface EventPayload {
  [key: string]: string | number | boolean | undefined
}

export interface TelemetryEntry {
  event: AnalyticsEvent
  timestamp: string
  payload: EventPayload
}

const STORAGE_SESSION_KEY = 'sabi_telemetry_events'
const STORAGE_PERSISTENT_KEY = 'sabi_activation_funnel'
const STORAGE_MILESTONES_KEY = 'sabi_funnel_milestones'

export const trackEvent = (event: AnalyticsEvent, payload?: EventPayload): void => {
  try {
    const timestamp = new Date().toISOString()
    const entry: TelemetryEntry = {
      event,
      timestamp,
      payload: payload || {},
    }

    // 1. Ephemeral session store (for fast in-browser inspection)
    const sessionTrail = sessionStorage.getItem(STORAGE_SESSION_KEY)
    const sessionList: TelemetryEntry[] = sessionTrail ? JSON.parse(sessionTrail) : []
    sessionList.push(entry)
    if (sessionList.length > 100) sessionList.shift()
    sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionList))

    // 2. Persistent store (survives tab closure, auth redirects, and reloads)
    const persistentTrail = localStorage.getItem(STORAGE_PERSISTENT_KEY)
    const persistentList: TelemetryEntry[] = persistentTrail ? JSON.parse(persistentTrail) : []
    persistentList.push(entry)
    if (persistentList.length > 250) persistentList.shift()
    localStorage.setItem(STORAGE_PERSISTENT_KEY, JSON.stringify(persistentList))

    // 3. Optional backend ingestion endpoint if configured
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT
    if (endpoint) {
      navigator.sendBeacon?.(endpoint, JSON.stringify(entry))
    }

    // 4. Clean development logging
    if (import.meta.env.DEV) {
      console.log(`[Sabi Funnel] ${event}`, payload || '')
    }
  } catch {
    // Fail silently without disrupting user operations
  }
}

/**
 * Tracks a milestone event once per browser/account to guarantee
 * accurate first_capture, first_deal_created, first_followup counts.
 */
export const trackMilestone = (
  milestone: 'first_capture' | 'first_deal_created' | 'first_followup',
  payload?: EventPayload
): void => {
  try {
    const milestonesRaw = localStorage.getItem(STORAGE_MILESTONES_KEY)
    const milestones: Record<string, boolean> = milestonesRaw ? JSON.parse(milestonesRaw) : {}

    if (!milestones[milestone]) {
      milestones[milestone] = true
      localStorage.setItem(STORAGE_MILESTONES_KEY, JSON.stringify(milestones))
      trackEvent(milestone, { ...payload, is_first_time: true })
    }
  } catch {
    // Fallback directly to trackEvent
    trackEvent(milestone, payload)
  }
}

/**
 * Returns summary activation metrics for audit or debugging.
 */
export const getFunnelStatus = (): Record<string, boolean | number> => {
  try {
    const milestonesRaw = localStorage.getItem(STORAGE_MILESTONES_KEY)
    const milestones: Record<string, boolean> = milestonesRaw ? JSON.parse(milestonesRaw) : {}
    const persistentTrail = localStorage.getItem(STORAGE_PERSISTENT_KEY)
    const list: TelemetryEntry[] = persistentTrail ? JSON.parse(persistentTrail) : []

    return {
      has_landing_view: list.some(e => e.event === 'landing_view'),
      has_auth_started: list.some(e => e.event === 'auth_started'),
      has_auth_completed: list.some(e => e.event === 'auth_completed'),
      has_first_capture: !!milestones['first_capture'],
      has_first_deal_created: !!milestones['first_deal_created'],
      has_first_followup: !!milestones['first_followup'],
      total_events_logged: list.length,
    }
  } catch {
    return { error: true }
  }
}
