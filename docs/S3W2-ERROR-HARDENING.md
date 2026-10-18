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

| ID                  | Status | Notes                                                                                                                                                     |
| ------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Error-message rules | ✅     | Plain message, way forward, announced, header/nav unaffected, details in console only                                                                     |
| ERR-01 to ERR-03    | ✅     | See above                                                                                                                                                 |
| ERR-04              | ❌     | A failed read on a detail link shows the Browse ERR-01 message, not an in-modal "We couldn't load this ticket." with Retry/Close and focus on the message |
| ERR-05              | ⚠️     | "Ticket not found" modal, no crash; the control is a "Back to browse" button, not a "Back to tickets" link                                                |
| ERR-06, ERR-07      | N/A    | No add to cart or sold-out state                                                                                                                          |
| ERR-08              | ⚠️     | Compare has no per-ticket reads (one shared catalog), so a failure shows the page-level ERR-01 message, not per column                                    |
| ERR-09              | ❌     | Compare has no shareable link; a selected ticket that leaves the catalog is dropped without "One ticket is no longer available"                           |
| ERR-10              | ✅     | `role="alert"`; Retry and Back are keyboard reachable                                                                                                     |
| EMP-01              | ❌     | No sold-out data or waitlist link                                                                                                                         |
| EMP-02              | ⚠️     | Wording is "No tickets available" rather than "No tickets are on sale yet. Check back soon."; not announced                                               |
| EMP-03              | N/A    | No filters or search                                                                                                                                      |
| EMP-04              | ✅     | "Select 2 or 3 tickets to compare" with a Browse tickets link                                                                                             |
| EMP-05              | ⚠️     | Shows the prompt and names the ticket, but not the ticket's details                                                                                       |
| EMP-06, FS-05       | ✅     | "Not specified for this ticket", "View description coming soon."                                                                                          |
| FS-01, FS-02, FS-06 | ✅     | See above                                                                                                                                                 |
| FS-03               | ✅     | The only reads are the initial load and Retry                                                                                                             |
| FS-04               | ⚠️     | Fallbacks read "Circuit map image unavailable." / "Map location unavailable for this zone.", not "Zone map not available"                                 |
| A11Y-01             | ⚠️     | Browse/Compare map descriptions name the zone; the detail modal image alt does not                                                                        |
| A11Y-02, 07, 10     | ✅     | One h1, headings/lists, real table, keyboard, named controls                                                                                              |
| A11Y-03             | ❌     | Compare differences are a gold row tint plus a footnote; rows have no text or icon marker                                                                 |
| A11Y-04             | ❌     | `text-zinc-500` is 3.7:1 (3.0:1 on highlighted rows): `PageHeader` and `EmptyState` descriptions, Compare "Not specified" and footnote                    |
| A11Y-05             | ⚠️     | Focus outline 6.6:1; secondary button borders (`white/15`) are 1.6:1                                                                                      |
| A11Y-06             | ✅     | Verified in S3W1 browser checks; not re-run                                                                                                               |
| A11Y-08             | ⚠️     | Modal focus and Retry are correct; removing a Compare column drops focus to the page                                                                      |
| A11Y-09, 11         | ✅     | 2px outlines; errors are text plus an icon                                                                                                                |
| A11Y-12             | ⚠️     | Loading, error and selection count are announced; empty states and Compare removals are not                                                               |
| A11Y-13             | ⚠️     | `lang="en"`; Compare title matches; Browse title is "Browse tickets", not "Tickets"                                                                       |
| 44px team standard  | ✅     | Ticket, map and error controls are at least 44px                                                                                                          |

## Dashboard circuit overview

`CircuitMap` has an `overview` prop. It shows the Albert Park map with an overview description and no zone
overlay, caption or highlight control. The dashboard uses it in place of the "Circuit map" placeholder.

## Homepage video

The asset was valid (H.264, faststart, served with byte ranges). `motion-reduce:hidden` removed the video
whenever the OS asked for reduced motion (for example, Windows "Show animations" off). `HeroVideo` always
renders it, sets `muted`, calls `play()` on mount, and adds a 44px pause/play button (WCAG 2.2.2). If autoplay
is blocked, the poster stays and the button shows **Play**.

## Verification

- `pnpm run test:component`: 77 tests passed across 8 files.
- `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`, `pnpm --filter frontend build`: passed.
- Not yet verified in a signed-in browser session against live Firebase, or with a screen reader.
