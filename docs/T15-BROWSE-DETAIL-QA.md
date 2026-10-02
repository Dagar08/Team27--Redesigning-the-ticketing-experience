# T15 - Browse/detail defects, zone indicator, deployment

Date: 2 October 2026. Branch: `fix/ticket-detail-defects`.

Source: the [T7 report and gap log in PR #31](https://github.com/Dagar08/Team27--Redesigning-the-ticketing-experience/pull/31),
reviewed against the existing six seeded ticket types and the reports in this chat.
All 13 recorded gaps have a disposition below. Deferred criteria are not claimed as passing.

## Gap dispositions

| Gap                                          | Scenarios                | Disposition                             | Change or reason and next owner                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------- | ------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G-01 - tier badge / view quality             | B-02                     | Deferred                                | The schema has no approved tier or view-quality fields. Product/data owner must supply labels and ratings; ticket names and view descriptions remain visible. No quality rating is inferred from price.                                                                                                                                                                           |
| G-02 - alphabetical ordering                 | B-04                     | Resolved                                | Price ascending is the default, with alphabetical names for equal prices. A recommended priority can be added once defined by product.                                                                                                                                                                                                                                            |
| G-03 - hover / active states                 | B-11, B-12               | Resolved                                | Cards have a hover border and focus-within state; ticket buttons have a pressed background and visible keyboard outline. Tailwind hover styles apply on devices that support hover.                                                                                                                                                                                               |
| G-04 - sold out / low stock                  | B-14 to B-17, D-23, D-24 | Deferred                                | There is no inventory field or reservation service. The checkout/inventory owner must supply stock and atomic availability checks before purchase. Catalog reference reads cannot truthfully announce stock.                                                                                                                                                                      |
| G-05 - price ranges                          | B-18                     | Deferred                                | Existing documents have one `priceAud` value. Product/data owner must provide a range schema and clarify which dates/tiers the range covers.                                                                                                                                                                                                                                      |
| G-06 - sold-out empty wording / waitlist     | B-19, B-20               | Deferred                                | An empty catalog does not prove that tickets sold out. The neutral empty state is retained. Product must supply a working availability-notification flow and destination before adding a waitlist link.                                                                                                                                                                           |
| G-07 - skeleton loading                      | B-21                     | Resolved                                | Card skeletons replace the spinner while the catalog loads; loading is announced once and animation respects reduced-motion preferences.                                                                                                                                                                                                                                          |
| G-08 - touch targets                         | B-25                     | Resolved                                | Browse/detail buttons, including close and selected-ticket openers, have a minimum 44px height and width.                                                                                                                                                                                                                                                                         |
| G-09 - actual dates                          | D-03                     | Deferred                                | `daysCovered` contains weekday labels without event dates or a year. The event/data owner must supply dates; real dates are not guessed from the mockups.                                                                                                                                                                                                                         |
| G-10 - seat description / zone map           | D-04, D-05, D-20         | Partly resolved; map/seat data deferred | The detail modal has a labelled visual location indicator driven directly by `zone`, including a missing-zone fallback. It shows `Zone map not available` and an explicit missing-seat-allocation message. Product/design must supply an approved venue map and zone/seat mapping before spatial highlights can be claimed accurate. Existing seating details remain in Includes. |
| G-11 - cart behavior                         | D-10, D-11               | Deferred                                | The current flow selects distinct ticket types for comparison. The cart/checkout owner must implement quantities, limits, availability rechecks, and confirmations. Comparison selection is not represented as a cart or reservation.                                                                                                                                             |
| G-12 - browser Back / direct links / refresh | D-13, D-28               | Resolved                                | The modal uses `?ticket=<document id>` and native browser history. Back closes the modal; Forward reopens it. Valid deep links restore details; invalid IDs show a clear not-found state. Closing a direct link removes the query without leaving Browse.                                                                                                                         |
| G-13 - restrictions                          | D-22                     | Deferred                                | There is no restriction field in the seed/schema. Product/data owner must supply restrictions and their required presentation before a warning can be rendered.                                                                                                                                                                                                                   |

`G-00` in the scenario spreadsheet is an example row, not a separate recorded defect.

## Additional fixes and clarifications

- Existing Firestore Lite reads avoid the reported `ca9` / `b815` watch-stream failure.
  Retry starts a new request; a 15-second timeout and stale-request cleanup remain covered.
- The native dialog still opens over Browse and closes on X, Escape, or outside click.
  Background scrolling is locked while open; long content scrolls within the modal.
  Closing restores focus to the opener without moving the browse scroll position.
- Ticket type and price stay visible in a sticky modal header. Below 768px, benefit lists
  stack into a single column. Long content can scroll rather than being truncated.
- The comparison feature previously rejected a fourth selection silently. It now displays
  the three-ticket limit and disables further additions until a selection is removed.
- Missing view descriptions use the T7 wording: `View description coming soon.`
- The earlier GitHub Actions stale-link/duplicate-control queries are fixed. New tests
  scope actions to their browse, selection, and modal regions.
- The old QA report's verification-email delivery and missing team photos are outside
  browse/detail. Email delivery remains with the authentication owner; team photos
  remain with the team-content owner. T15 does not mark them resolved.

## Verification and deployment

| Check                             | Result                                                                            |
| --------------------------------- | --------------------------------------------------------------------------------- |
| Frontend component tests          | 31 passed across 3 files, including 21 ticket tests                               |
| Backend unit tests                | 5 passed across 2 files                                                           |
| Both package lint checks          | Passed                                                                            |
| Both package typechecks           | Passed                                                                            |
| Next.js production build          | Passed on Next.js 16.3.6                                                          |
| Dependency audit at high severity | Passed; 0 high/critical findings, 9 moderate findings remain                      |
| Real Firestore browser checks     | All 14 passed in Microsoft Edge 154.0.4258.48 against the local production build  |
| Responsive checks                 | 375px, 768px and 1280px; no horizontal overflow and ticket controls at least 44px |

Browser checks covered verified sign-in/server sessions, all six seeded ticket types
in price order, zone/days/view/benefits, add/remove synchronization, focus and scroll
restoration, Escape/outside clicks, Back/Forward, refresh/direct links, invalid IDs,
the selection limit, and a failed Firestore request followed by a successful Retry.
No uncaught browser errors occurred. Desktop and mobile screenshots were visually
reviewed. The disposable local QA account and profile were removed after the run.

Verified implementation: `a287f19`; dependency patches: `c0a8302`.

Deployment to the documented live URL,
<https://team27-redesigning-the-ticketing-ex.vercel.app>, is pending the reviewed PR
and its production release. The current public home page returns HTTP 200, but
`/tickets` returns HTTP 404 because the ticket prerequisites have not reached main.

**Signed-in live verification is deferred at the user's request.** Production uses
Firebase `team27-grandprixproject`; local credentials belong to
`showcase-capstone-grand-prix`. No verified production test account or Admin access
is available. A team member with that access must confirm production ticket reads,
modal details/zone and Retry after deployment. Local results do not establish that
production Firestore rules, seed data or auth configuration are correct.

T15 is ready for review; the production deployment criterion is not yet complete.
