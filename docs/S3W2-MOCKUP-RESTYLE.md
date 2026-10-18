# S3W2 - Mockup restyle

Date: 14 October 2026. Branch: `feature/s3w2-mockup-restyle`, stacked on
`feature/s3w2-error-hardening-dashboard`.

The app now follows the approved UI mockups (red, black and white; Archivo and Inter) instead of
the green-and-gold build that the [divergence analysis](sprint-2-ui/week-3/Divergence%20between%20Approved%20and%20Built%20UI-UX.pdf)
flagged. Tokens, type and patterns are documented in the [design system](DESIGN.md).

## Decisions

| Question                          | Decision                                                                                                                                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mockup features with no backend   | Style what exists. No cart, quantity, Buy now, checkout, Schedule/Standings/News pages, incentive tags or ticket photos were added.                                                                                           |
| Mockup colours that fail contrast | The [Colour Contrast Audit](sprint-3-ui/week-1/Colour%20Contrast%20Audit.docx) wins: `#e10600` for fills, borders and large text; `#ff3b30` for small red text; card borders `#5c5d61` (3.1:1) instead of the mockups' 1.4:1. |
| Compare                           | Stays a page (same URL and title), restyled as equal-width side-by-side cards on a real table, with "Differs" labels.                                                                                                         |
| Mobile                            | One black palette at every width (the mobile mockup's navy was not used), plus the mockup's bottom tab bar.                                                                                                                   |

## Screen by screen

| Screen       | Mockup                             | Notes                                                                                                         |
| ------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Shell        | All signed-in mockups              | "GARAGE" wordmark, active nav tint + red bar, Grand Prix badge, "GP.01 // MEL" tag, mobile tab bar            |
| Dashboard    | Revised Dashboard Desktop / Mobile | Red hero with "View event", standings, circuit overview with stat tiles, races, pass, upgrades, events        |
| Browse       | Browse Tickets (+ with Comparison) | Return link in the header row, red hero, map image area, red prices, Compare checkboxes, big COMPARE button   |
| Detail modal | Ticket Details Modal               | Huge name, X, red price, zone pill, map with zone highlight, included / not included / Compare columns        |
| Compare      | Compare Tickets                    | Card columns, red-square features, Remove kept (the divergence analysis called it an improvement)             |
| States       | Individual Loading, Modal Error    | Glinting skeletons in card positions; centred message with a large red-outlined RETRY                         |
| Landing      | Login Page                         | Glass card with car mark, "GARAGE", divider, Sign in / Create account; the race video stays as the background |
| Sign in / up | (none; Login and Checkout styles)  | Same card language; red-bordered inputs with bold italic labels from the checkout mockup                      |
| Team         | Team Page                          | "MEET THE TEAM", divider, one panel with photo, name and role, first member centred                           |

## Deliberate differences

- Hero banners use a red gradient with skyline line art: the Melbourne photos in the mockups are not
  in the repo (the existing poster is from Spa).
- Prices are exact ("$235 AUD"), not "From $300": each ticket type has a single price.
- The ticket image area shows the zone's circuit map, the closest real "view of the ticket".
- Sidebar items are the existing pages (Dashboard, Tickets, Team, Profile, Settings).
- The login mockup's placeholder copy ("Your app description goes here", the code chip) was replaced
  with real copy.
- "Welcome back" is title case on phones so the name fits, as in the mobile mockup.

## Follow-up fixes

- **Double scrollbar on Browse:** the shell's `<main>` is `relative`, so `sr-only` text stays inside
  the scroll area instead of stretching the page.
- **Selectable hero watermark:** the banner's decorative text and skyline ignore the pointer and
  text selection.
- **Stuck zone highlight:** only keyboard focus emphasises a zone. A click no longer keeps it lit
  after unpinning, and a tap leaves no hover behind (this bug predates the restyle).
- **Stuck red card border:** cards turn red for keyboard focus only (`has-focus-visible`), not after
  a mouse click (this also predates the restyle, in green).
- **Compared tickets:** every ticket ticked for Compare keeps a red card border until unticked.

## Verification

- `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:component` (80 tests),
  `pnpm run test` and `pnpm --filter frontend build` passed.
- Visual check: the real components and CSS were rendered in an isolated harness (auth, Firestore
  and Next routing mocked with the seed data) and screenshotted with headless Edge at 1440px and
  390px, then compared with each mockup. Not yet checked signed in against live Firebase.
