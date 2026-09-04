# Engineering Implementation Plan — Pre-Launch Launch-Critical Priorities

**Target Launch Date**: September 9, 2026  
**Operating Principle**: *Measure → Diagnose → Fix → Verify → Document*  
**Core Mission**: Deliver Budget Confidence through planning.

---

## Executive Summary & Engineering Commitments

This plan provides the exact, production-ready implementation to resolve the three pre-launch engineering priorities without introducing unrelated features, speculative architecture, or new third-party dependencies:

1. **Priority 1 (P0) — Minimum Viable Analytics V1 & CEO Dashboard**:
   - Establish the canonical **Analytics Event Contract** covering Acquisition, Planning, Sharing, Engagement, Feedback, Monetization, and Reliability.
   - Eliminate hardcoded zero-UUID session IDs in client components by deploying a non-blocking `trackClient` utility that reads the persistent `oya_session_id` cookie.
   - Deliver the **CEO Executive Metrics Dashboard** inside `/admin/usage` displaying true activation, save rate, share rate, recipient engagement, second-plan rate, failure rates, and UTM attribution.
2. **Priority 2 (P0) — Account Module Latency Elimination**:
   - Eliminate the 3 identified causes of intermittent latency:
     1. Redundant GoTrue network calls caused by duplicate `SessionResolver.resolveIdentity()` invocations.
     2. Heavy 3-table relational joins (`user_saved_plans` → `shared_plans` → `spots`) when only a count is needed.
     3. Client-side hydration waterfall in `AccountClient.tsx`.
   - Implement `SavedPlanService.getSavedPlansCount(userId)` with index-backed count queries.
3. **Priority 3 (P1) — Resilient Venue Imagery System**:
   - Deploy database migration `0047_spots_view_cover_url.sql` to expose `cover_url` and `image_url` in the backwards-compatible `public.spots` view.
   - Build a zero-fail `VenueImage` component with progressive loading, error state machine, and branded architectural fallbacks.
   - Eliminate dead queries (e.g. 300-spot fetch on shared plan view).

---

## Technical Audit & Root-Cause Diagnosis

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                CURRENT ARCHITECTURAL DEFECTS                           │
├─────────────────────────┬──────────────────────────────────┬───────────────────────────┤
│ 1. Analytics Disconnect │ 2. Account Latency Waterfall     │ 3. Venue Imagery Ingestion│
├─────────────────────────┼──────────────────────────────────┼───────────────────────────┤
│ • Zero-UUID Hardcoded:  │ • GoTrue Auth duplicated 2-3x    │ • public.spots view lacks │
│   '00000000-0000-...'   │ • SavedPlanService queries all   │   cover_url / image_url   │
│   in client components  │   relations just for count       │ • Missing onError state   │
│ • No unified client SDK │ • AccountClient useEffect runs   │   machine (broken image)  │
│ • CEO metrics missing   │   redundant server action        │ • /plan/[id] fetches 300  │
│   funnel conversion math│ • 2-4s cold/warm response delay  │   spots never rendered    │
└─────────────────────────┴──────────────────────────────────┴───────────────────────────┘
```

---

## Files Affected Upfront

| Domain | Files to Modify | Files to Create |
|---|---|---|
| **Analytics** | • `lib/services/analytics/types.ts`<br>• `lib/services/analytics/analyticsService.ts`<br>• `app/api/v1/analytics/track/route.ts`<br>• `components/PlannerWidget.tsx`<br>• `components/SavePlanButton.tsx`<br>• `components/WhatsAppCopyButton.tsx`<br>• `app/forge/ForgeResultsClient.tsx`<br>• `components/providers/AnalyticsProvider.tsx`<br>• `components/AuthModal.tsx`<br>• `app/admin/usage/page.tsx`<br>• `app/admin/usage/UsageTable.tsx` | • `lib/analytics/trackClient.ts`<br>• `lib/admin/services/ceoAnalyticsService.ts`<br>• `components/admin/CeoDashboardMetrics.tsx` |
| **Account** | • `app/account/page.tsx`<br>• `app/account/AccountClient.tsx`<br>• `lib/services/identity/savedPlanService.ts`<br>• `lib/actions/getReferralCode.ts` | — |
| **Imagery** | • `components/explore/VenueCard.tsx`<br>• `components/editorial/PlanHeader.tsx`<br>• `app/plan/[id]/page.tsx`<br>• `lib/actions/sharePlan.test.ts` | • `supabase/migrations/0047_spots_view_cover_url.sql`<br>• `components/ui/VenueImage.tsx` |

---

## Detailed Step-by-Step Implementation

### Phase 1 — Priority 1: Analytics V1 & CEO Funnel

#### 1.1 Canonical Event Taxonomy (`lib/services/analytics/types.ts`)
Update `EventSchemas` with strict Zod validation without using `any`:
- **Acquisition**:
  - `landing_page_view`: `{ path: string, ref?: string, utm_source?: string, utm_medium?: string, utm_campaign?: string }`
  - `auth_initiated`: `{ source: string, path: string }`
  - `signup_completed`: `{ user_id: string, method: string, source?: string }`
  - `utm_captured`: `{ utm_source?: string, utm_medium?: string, utm_campaign?: string }`
  - `deep_link_resolved`: `{ source: string, utm_campaign?: string }`
- **Planning (Core Activation)**:
  - `forge_started`: `{ source?: string, area?: string, budget?: number, squad_size?: number }`
  - `forge_completed`: `{ budget?: number, squad_size?: number, vibe?: string, start_area?: string, plans_generated?: number, top_spot_id?: string, duration_ms?: number }`
  - `plan_saved`: `{ shared_plan_id: string, spot_id?: string, total_cost?: number }`
  - `plan_shared`: `{ plan_id: string, share_method: string }`
- **Sharing & Virality**:
  - `shared_plan_opened`: `{ plan_id: string, referrer?: string, utm_source?: string }`
  - `recipient_engaged`: `{ plan_id: string, action: 'vote' | 'save' | 'plan_own' | 'whatsapp_join' }`
- **Engagement**:
  - `venue_viewed`: `{ spot_id: string, rank?: number, area?: string }`
  - `budget_breakdown_viewed`: `{ spot_id: string, total_cost: number }`
  - `transport_breakdown_viewed`: `{ origin: string, destination: string, mode: string }`
  - `budget_modified`: `{ previous_budget: number, new_budget: number }`
- **Feedback / Trust**:
  - `actual_spend_submitted`: `{ shared_plan_id: string, spot_id: string, actual_total: number, estimated_total: number }`
  - `price_accuracy_reported`: `{ venue_id: string, status: 'accurate' | 'changed' | 'outdated' }`
  - `plan_usefulness_rated`: `{ plan_id: string, rating: 'up' | 'down' }`
  - `transport_actual_feedback`: `{ mode: string, result: 'about_right' | 'higher' | 'lower', actual_amount?: number }`
- **Reliability & Errors**:
  - `plan_generation_failed`: `{ start_area: string, budget: number, squad_size: number, reason: string }`
  - `account_load_failed`: `{ user_id?: string, error: string }`
  - `api_error`: `{ endpoint: string, status_code: number, error_message: string }`

#### 1.2 Unified Client Tracking Transport (`lib/analytics/trackClient.ts`)
```typescript
export function getSessionId(): string {
  if (typeof document === 'undefined') return '00000000-0000-0000-0000-000000000000';
  const match = document.cookie.match(/(?:^|; )oya_session_id=([^;]*)/);
  if (match && match[1]) return decodeURIComponent(match[1]);
  // Fallback to localStorage or transient memory
  let fallback = window.sessionStorage.getItem('oya_session_id');
  if (!fallback) {
    fallback = crypto.randomUUID();
    window.sessionStorage.setItem('oya_session_id', fallback);
  }
  return fallback;
}

export function trackEvent<T extends EventName>(
  eventName: T,
  properties: z.infer<typeof EventSchemas[T]>
): void {
  try {
    const session_id = getSessionId();
    const payload = {
      event_name: eventName,
      session_id,
      properties: { ...properties, version: '1.0' },
      client_context: {
        browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        device_type: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
        referrer: typeof document !== 'undefined' ? document.referrer : undefined
      }
    };

    const serialized = JSON.stringify(payload);
    // Non-blocking beacon or fetch with keepalive
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([serialized], { type: 'application/json' });
      navigator.sendBeacon('/api/v1/analytics/track', blob);
    } else {
      fetch('/api/v1/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: serialized,
        keepalive: true
      }).catch(() => {});
    }
  } catch (err) {
    // Analytics failures must never break the user experience
  }
}
```

#### 1.3 Wire All Client Tracking Points
Replace all hardcoded zero-UUID calls in:
- `PlannerWidget.tsx` → `trackEvent('forge_started', { source: 'hero_planner', ... })`
- `ForgeResultsClient.tsx` → `trackEvent('forge_completed', { ... })`
- `SavePlanButton.tsx` → `trackEvent('plan_saved', { shared_plan_id: planId, ... })`
- `WhatsAppCopyButton.tsx` → `trackEvent('plan_shared', { plan_id: result.id, share_method: 'whatsapp' })`
- `AuthModal.tsx` → `trackEvent('auth_initiated', { source, path })`
- `AnalyticsProvider.tsx` → `trackEvent('page_viewed', { path: pathname })`

#### 1.4 CEO Analytics Engine (`lib/admin/services/ceoAnalyticsService.ts`)
Expose executive metrics derived directly from `raw_product_events`, `plan_requests`, `shared_plans`, and `profiles`:
```
• Activation Rate = (Unique users/sessions with ≥ 1 forge_completed) / (Unique users/sessions with forge_started)
• Save Rate = (Total plan_saved events) / (Total forge_completed events)
• Share Rate = (Total plan_shared events) / (Total forge_completed events)
• Recipient Engagement Rate = (Total shared_plan_opened events) / (Total shared_plans created)
• Second-Plan Rate = (Users with ≥ 2 plans generated) / (Users with ≥ 1 plan generated)
• Failure Rate = (plan_generation_failed events) / (forge_started events)
• Acquisition Breakdown = Grouping of utm_source / referrer_code
```

#### 1.5 CEO Dashboard UI Integration (`components/admin/CeoDashboardMetrics.tsx`)
Embed a high-visibility, executive funnel overview in `app/admin/usage/page.tsx` with clean conversion visual indicators.

---

### Phase 2 — Priority 2: Account Module Performance

#### 2.1 Identify Bottlenecks & Measure
- **Bottleneck 1**: `SessionResolver.resolveIdentity()` called repeatedly in series (network call to GoTrue auth + DB query to profiles).
- **Bottleneck 2**: `SavedPlanService.getSavedPlans()` selects deep nested relations (`shared_plans`, `spots`) for every saved plan, when the page only displays a total count number (`savedPlansCount`).
- **Bottleneck 3**: `AccountClient.tsx` executes a client `useEffect` calling `getReferralCode()` after initial render.

#### 2.2 Implement High-Speed Count Query (`lib/services/identity/savedPlanService.ts`)
```typescript
static async getSavedPlansCount(userId: string): Promise<number> {
  try {
    const supabase = await createServerClient();
    const { count, error } = await supabase
      .from('user_saved_plans')
      .select('shared_plan_id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      captureServerException(error);
      return 0;
    }
    return count ?? 0;
  } catch (error) {
    captureServerException(error);
    return 0;
  }
}
```

#### 2.3 Optimize Server Page (`app/account/page.tsx`)
Streamline data retrieval into a single parallelized pass with zero duplicate GoTrue roundtrips:
```typescript
export default async function AccountPage() {
  const identity = await SessionResolver.resolveIdentity();
  const isAuthenticated = identity.type === 'authenticated';

  let savedPlansCount = 0;
  let referralCode: string | null = null;

  if (isAuthenticated) {
    const userId = identity.profile.id;
    const [countResult, codeResult] = await Promise.all([
      SavedPlanService.getSavedPlansCount(userId),
      getReferralCode(userId)
    ]);
    savedPlansCount = countResult;
    referralCode = codeResult;
  }

  return (
    <AccountClient
      isAuthenticated={isAuthenticated}
      profile={identity.profile}
      savedPlansCount={savedPlansCount}
      referralCode={referralCode}
    />
  );
}
```

#### 2.4 Eliminate Client Waterfall in `AccountClient.tsx`
Remove `useEffect` query when `referralCode` is already provided by the server.

---

### Phase 3 — Priority 3: Venue Imagery Architecture

#### 3.1 Migration `0047_spots_view_cover_url.sql`
Update `public.spots` view to project `v.cover_url AS cover_url`, `v.cover_url AS image_url`, and `v.logo_url AS logo_url`:
```sql
CREATE OR REPLACE VIEW public.spots AS
SELECT 
    v.id,
    v.name,
    v.address,
    v.district_id AS area_id,
    v.vibe_tags,
    v.derived_typical_cost AS price_per_person,
    v.last_price_updated_at AS price_updated_at,
    v.last_price_source AS price_source,
    COALESCE(
        (
            SELECT jsonb_object_agg(d.slug, tro.fixed_cost_low)
            FROM public.transport_route_overrides tro
            JOIN public.districts d ON tro.origin_district_id = d.id
            WHERE tro.destination_district_id = v.district_id AND tro.mode_slug = 'uber-x'
        ), '{}'::jsonb
    ) AS transport_matrix,
    v.is_featured,
    v.active,
    v.category,
    v.subcategory,
    v.typical_duration_hours,
    v.instagram_handle,
    v.derived_price_tier AS price_tier,
    NULL::TEXT AS crowd_type,
    NULL::TEXT AS best_daypart,
    '{"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"}'::TEXT[] AS days_open,
    0::INTEGER AS trending_score,
    v.operational_status AS verified_by,
    'mainland'::TEXT AS zone,
    v.computed_confidence_score AS computed_confidence_score,
    v.confidence_reasons AS confidence_reasons,
    v.cover_url AS cover_url,
    v.cover_url AS image_url,
    v.logo_url AS logo_url
FROM public.venues v;
```

#### 3.2 Resilient `VenueImage` Component (`components/ui/VenueImage.tsx`)
Create a resilient image wrapper:
- Next.js `<Image>` with priority/sizes support.
- Loading shimmer / skeleton state.
- `onError` state handling that gracefully falls back to the branded Lagos silhouette / pattern without layout shift or broken icons.
- Accessible `alt` tags and proper aspect ratios.

#### 3.3 Apply to UI Surfaces
- Update `components/explore/VenueCard.tsx`
- Update `components/editorial/PlanHeader.tsx`
- Update `app/plan/[id]/page.tsx`
- Remove unused 300-spot `getForgeSpots()` database fetch from `app/plan/[id]/page.tsx`.

---

## Verification & Validation Plan

### 1. Automated Test Suite
- Run `npx vitest run` and ensure 100% of test suites pass.
- Fix `lib/actions/sharePlan.test.ts` by properly mocking `SessionResolver.resolveIdentity`.

### 2. TypeScript & Lint
- Run `npx tsc --noEmit` (0 errors).
- Verify no new `any` or lint violations in modified files.

### 3. Latency & Network Measurement
- Measure `/account` response:
  - Query count reduced from 4+ to 2 parallel queries.
  - Latency baseline vs post-fix verified.
- Measure `/plan/[id]` response:
  - 300-row `getForgeSpots` query eliminated.

### 4. Analytics Ingestion Test
- Submit test events to `/api/v1/analytics/track` with genuine `oya_session_id`.
- Check `raw_product_events` insertion and verify CEO dashboard calculations.

---

## Risk & Rollback Strategy

| Change | Risk Assessment | Rollback Action |
|---|---|---|
| `0047_spots_view_cover_url.sql` | Low. View extension adding 3 columns. Fully backwards-compatible with all existing SELECT queries. | Re-execute view definition from migration `0012`. |
| `trackClient.ts` | Low. Fails safe. `navigator.sendBeacon` and `keepalive` fetch wrapped in try-catch; never blocks UI thread. | Remove `trackEvent` dispatch. |
| `getSavedPlansCount` | Low. Standard indexed count query on primary key column. | Revert to previous `getSavedPlans()` length check. |
