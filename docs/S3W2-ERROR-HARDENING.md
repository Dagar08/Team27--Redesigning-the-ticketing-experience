# S3W2 - Error and empty-state hardening, dashboard integration

Date: 14 October 2026. Branch: `feature/s3w2-error-hardening-dashboard`, based on main `802ac32`.
Criteria source: _S3W1 Accessibility and Error-Handling Acceptance Criteria_ (Matthew Kwong, 11 Oct 2026).

## Checklist

- [x] Render `CircuitMap` in the dashboard Circuit overview.
- [x] Homepage background video runs (including with reduced motion enabled), with a pause control.
- [x] Browse meets ERR-01 → ERR-03, plus FS-01, FS-02 and FS-06.
- [x] Component tests named after the criterion IDs they verify.

## ERR-01 → ERR-03 (Browse)

| ID     | Implementation                                                                                                                                                                                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ERR-01 | Any failed read (network, server, permissions, or no response in **10 seconds**) shows exactly "We couldn't load tickets right now. Please try again." in a `role="alert"` with **Retry**. No cards or selection panel render. The raw error goes to `console.error` only. |
| ERR-02 | Retry shows the loading skeleton, then the list. The error disappears and focus moves to the reloaded results (`useRetryFocus`).                                                                                                                                           |
| ERR-03 | A repeat failure shows the same message, focus returns to **Retry**, and nothing reloads or re-requests on its own.                                                                                                                                                        |

Related: FS-01 and FS-02 use the same message. FS-03 shows "You're offline. Check your connection and try again."
when `navigator.onLine` is false. FS-06 (`normalizeTicketType`) hides records with no name or no positive
price and logs a warning, so "undefined", "NaN" or "$0" never render. Compare reuses the ERR-01 message,
Retry and focus handling. The `error.tsx` crash boundaries (`RouteError`) follow the same "no technical
text" rule and never show the error message or digest.

## Full criteria status

✅ met · ⚠️ partial · ❌ not met · N/A feature not built

| ID                  | Status | Notes                                                                                                                                                                        |
| ------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Error-message rules | ✅     | Plain message, way forward, announced, header/nav unaffected, details in console only                                                                                        |
| ERR-01 to ERR-03    | ✅     | See above                                                                                                                                                                    |
| ERR-04              | ✅     | A failed read on a detail link opens the modal with "We couldn't load this ticket.", Retry and Close; focus starts on the message and returns to it after a repeat failure   |
| ERR-05              | ✅     | "Ticket not found" modal, no crash, with a **Back to tickets** link (`href="/tickets"`; a plain click closes the modal in place)                                             |
| ERR-06, ERR-07      | N/A    | No add to cart or sold-out state                                                                                                                                             |
| ERR-08              | ⚠️     | By design: Compare has no per-ticket reads (one shared catalog), so a failure shows the page-level ERR-01 message, not per column. Per-column errors need per-ticket reads   |
| ERR-09              | ✅     | Compare URLs are shareable (`?tickets=a,b`). Selected tickets missing from the catalog show "One ticket is no longer available. It has been removed from this comparison."   |
| ERR-10              | ✅     | `role="alert"`; Retry and Back are keyboard reachable                                                                                                                        |
| EMP-01              | ❌     | Data dependency: `ticketType` has no sold-out or waitlist field. Needs a schema change before UI work                                                                        |
| EMP-02              | ✅     | "No tickets are on sale yet." / "Check back soon.", announced (`EmptyState announce`)                                                                                        |
| EMP-03              | N/A    | No filters or search                                                                                                                                                         |
| EMP-04              | ✅     | "Select 2 or 3 tickets to compare" with a Browse tickets link                                                                                                                |
| EMP-05              | ✅     | Shows the prompt, names the ticket, and shows its details in a one-column Compare table                                                                                      |
| EMP-06, FS-05       | ✅     | "Not specified for this ticket", "View description coming soon."                                                                                                             |
| FS-01, FS-02, FS-06 | ✅     | See above                                                                                                                                                                    |
| FS-03               | ✅     | The only reads are the initial load and Retry                                                                                                                                |
| FS-04               | ✅     | Zone fallbacks read "Zone map not available." (the dashboard overview says "Circuit map not available.")                                                                     |
| A11Y-01             | ✅     | Browse, Compare and the detail modal all use `CircuitMap`, whose description names the zone (mockup restyle)                                                                 |
| A11Y-02, 07, 10     | ✅     | One h1, headings/lists, real table, keyboard, named controls                                                                                                                 |
| A11Y-03             | ✅     | Differing Compare rows have a tint **and** a visible "Differs" label (mockup restyle)                                                                                        |
| A11Y-04             | ✅     | No `zinc-500` text remains; small red text uses `gp-red-400` (5.3:1 or more). See [Contrast](DESIGN.md#contrast)                                                             |
| A11Y-05             | ✅     | Card, panel and secondary-button borders use `asphalt-600` (3.1:1); red outlines 4.1:1; white focus outline 20:1                                                             |
| A11Y-06             | ✅     | Re-checked at 390px and 1440px in the mockup restyle; Compare scrolls inside its own area                                                                                    |
| A11Y-08             | ✅     | Modal focus and Retry are correct; removing a Compare column or a selection entry focuses the next Remove button, or the prompt/heading when none remain (`useRemovalFocus`) |
| A11Y-09, 11         | ✅     | 2px white focus outlines; errors are plain-text messages                                                                                                                     |
| A11Y-12             | ✅     | Loading, errors, empty states, selection count and Compare removals are announced                                                                                            |
| A11Y-13             | ✅     | `lang="en"`; titles are "Tickets" and "Compare tickets"                                                                                                                      |
| 44px team standard  | ✅     | Ticket, map and error controls are at least 44px                                                                                                                             |

## Dashboard circuit overview

`CircuitMap` has an `overview` prop. It shows the Albert Park map with an overview description and no zone
overlay, caption or highlight control. The dashboard uses it in place of the "Circuit map" placeholder.

## Homepage video

The asset was valid (H.264, faststart, served with byte ranges). `motion-reduce:hidden` removed the video
whenever the OS asked for reduced motion (for example, Windows "Show animations" off). `HeroVideo` always
renders it, sets `muted`, calls `play()` on mount, and adds a 44px pause/play button (WCAG 2.2.2). If autoplay
is blocked, the poster stays and the button shows **Play**.

## Follow-up fixes (28 October 2026)

Branch `feature/s3w3-final-fixes` closed the remaining fixable gaps:

- **ERR-04:** `TicketDetailsDialog` takes `onRetry` when the catalog read failed and shows the in-modal error state.
- **ERR-05:** the not-found control is a "Back to tickets" link.
- **ERR-09:** `compareHref()` builds the shareable link. Compare reads `?tickets=` once and keeps it in sync. The provider's `selectTickets` / `unavailableCount` report tickets that left the catalog.
- **EMP-02, EMP-05, FS-04, A11Y-12, A11Y-13:** wording, announcements and page title, as in the table above.
- **A11Y-08:** `useRemovalFocus` keeps focus on the page after Remove and Clear selection.

Still open: **EMP-01** (needs sold-out data) and **ERR-08** (needs per-ticket reads).

## Verification

- `pnpm run test:component`: 91 tests passed across 9 files, including new ERR-04, ERR-05, ERR-09, EMP-02, EMP-05, A11Y-08 and A11Y-12 tests.
- `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`, `pnpm --filter frontend build`: passed.
- Not yet verified in a signed-in browser session against live Firebase, or with a screen reader.
