# Design System

This is the design reference for the Australian Grand Prix ticketing redesign. Read it before
creating or editing any component, page or stylesheet.

The visual language comes from the approved UI mockups:

- `docs/UI Mockup Revised Dashboard Desktop.png` and `… Mobile.png`
- `docs/sprint-2-ui/week-1` and `week-2` (Browse, detail modal, Compare, loading/error states)
- `docs/assignment 1/UI Mockup - Login Page.png` and `UI Mockup - Team Page.png`

Contrast decisions follow `docs/sprint-3-ui/week-1/Colour Contrast Audit.docx` and the S3W1
accessibility criteria (WCAG 2.1 AA). Where a mockup colour fails, the accessible value wins; see
[Contrast](#contrast).

---

## Foundation: Tailwind CSS v4

Tailwind v4 with **CSS-first configuration**: there is no `tailwind.config.js`. Tokens live in
`@theme` in `frontend/src/app/globals.css`, and utilities are generated from them
(`bg-gp-red-500` just works).

- Define a token before using a new colour; no hex values in components.
- No inline `style=` attributes.
- Arbitrary values only where no utility exists (grid templates, `env(safe-area-inset-bottom)`).
- The app is **dark-only**. Do not add `dark:` variants or light surfaces.

---

## Colour

| Token                   | Value     | Use                                                     |
| ----------------------- | --------- | ------------------------------------------------------- |
| `asphalt-950`           | `#050607` | Page background                                         |
| `asphalt-900`           | `#08090b` | Cards, panels, sidebar                                  |
| `asphalt-800`           | `#111215` | Raised tiles (circuit stats), skeleton blocks           |
| `asphalt-600`           | `#5c5d61` | Component borders: cards, panels, secondary buttons     |
| `gp-red-500`            | `#e10600` | Fills, borders, icons, large text (prices)              |
| `gp-red-600`            | `#b80500` | Hover and pressed fills                                 |
| `gp-red-400`            | `#ff3b30` | **Small** red text: links, dates, labels, small prices  |
| `gp-red-950`            | `#22090b` | Active navigation tint, "differs" rows, glass cards     |
| `foreground`            | `#f5f5f5` | Body text (`text-white` is fine for headings)           |
| `zinc-300` / `zinc-400` | Tailwind  | Secondary text. **Never `zinc-500` or darker for text** |

`white/10` is fine for decorative internal dividers. Anything that identifies a component (card
edge, input, button outline) needs `asphalt-600` or red.

### Contrast

Measured against the page (`#050607`) unless stated.

| Pair                                | Ratio          | Rule                                         |
| ----------------------------------- | -------------- | -------------------------------------------- |
| `gp-red-500` text                   | 4.08:1         | Large text only (24px+, or 18.5px+ bold)     |
| `gp-red-400` text                   | 5.7:1          | Any size, including on `gp-red-950` (5.3:1)  |
| White on `gp-red-500` fill          | 4.97:1         | Buttons, tags, pills                         |
| `gp-red-500` border or icon         | 4.08:1         | Passes 3:1 non-text contrast                 |
| `asphalt-600` border                | 3.08:1         | Passes 3:1 (the mockups' `#26272a` is 1.4:1) |
| `zinc-300` / `zinc-400` text        | 13.7:1 / 7.7:1 | Secondary text                               |
| `gp-red-500` price on `gp-red-950`  | 3.80:1         | Large text on Compare "differs" rows         |
| White on `gp-red-600` (hover)       | 6.86:1         | Button hover state                           |
| White focus outline                 | 20:1           | Every focusable element                      |
| `gp-red-500` zone ring on white map | 4.97:1         | Circuit map overlays                         |

---

## Typography

Loaded with `next/font/google` in `app/layout.tsx`:

| Variable         | Font    | Tailwind       | Use                                                       |
| ---------------- | ------- | -------------- | --------------------------------------------------------- |
| `--font-archivo` | Archivo | `font-display` | Headings, ticket names, prices, ticket copy (wide, heavy) |
| `--font-inter`   | Inter   | `font-sans`    | Navigation, tables, forms, buttons, body text (default)   |

Archivo is loaded with its `wdth` axis and italics; widen it with `font-stretch-semi-expanded` or
`font-stretch-expanded`. Use the shared constants rather than rebuilding these:

| Constant (`@/lib/styles`) | Looks like                  | Use                                           |
| ------------------------- | --------------------------- | --------------------------------------------- |
| `displayTitle`            | **_YOUR TICKETS_**          | Page and section titles, back links           |
| `displayItalic`           | **_Australian Grand Prix_** | Event names on passes and race cards          |
| `displayBlock`            | **MAIN GRANDSTAND**         | Ticket names on cards and in the detail modal |
| `eyebrow`                 | small red italic caps       | Label above a heading ("RACE WEEK ACCESS")    |

---

## Shared styles (`frontend/src/lib/styles.ts`)

| Constant                                 | Use                                                               |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `buttonPrimary`                          | Filled red call to action ("VIEW EVENT", "SIGN IN")               |
| `buttonOutline`                          | Red outline ("VIEW DETAILS", "RETRY", "CREATE ACCOUNT")           |
| `buttonSecondary`                        | Neutral outline ("REMOVE", "CLEAR SELECTION")                     |
| `panel`                                  | Card and panel surface (`asphalt-900` + `asphalt-600` border)     |
| `textLink` / `inlineLink`                | Small red link / red link inside running text                     |
| `fieldLabel`, `fieldInput`, `fieldError` | Forms (red-bordered inputs, as in the checkout mockup)            |
| `focusRing`                              | White 2px outline; already included in the button and link styles |

All buttons are at least 44px tall (`min-h-11`), the team's touch-target standard. Compact pills
(e.g. "UPGRADE") extend their hit area with an `after:` pseudo-element instead.

Buttons render uppercase via CSS, so accessible names stay in sentence case ("Retry").

---

## Brand components (`frontend/src/components/brand/`)

| Component        | Use                                                                               |
| ---------------- | --------------------------------------------------------------------------------- |
| `Wordmark`       | "GARAGE", the mockups' brand mark (`NEXT_PUBLIC_APP_NAME` still sets page titles) |
| `GrandPrixBadge` | "N" ring + Australian Grand Prix, Melbourne (sidebar foot, landing)               |
| `RaceTag`        | Decorative "GP.01 // MEL" header tag                                              |
| `TrackDivider`   | Red rule with a timing-beam mark under large headings                             |
| `Skyline`        | Melbourne skyline line art                                                        |
| `CarMark`        | Race car silhouette (sign-in card)                                                |
| `RaceHero`       | Red event banner with title, venue, dates and an optional action                  |

CSS utilities in `globals.css`: `bg-race-hero` (hero gradient), `bg-race-stripes` (diagonal red
light streaks behind landing and auth), `skeleton` + `motion-safe:animate-shimmer` (loading glint).

---

## Layout

- `DashboardShell` = `Sidebar` (lg+) + `Navbar` + `MobileNav` (below lg). Both navs read
  `components/layout/navItems.ts`; add links there.
- The sidebar marks the current page with a red tint, a red left bar, a red icon and
  `aria-current="page"`. The mobile tab bar uses a red circle.
- `Navbar` shows "Welcome back, {name}" on the dashboard, and the page's "← RETURN TO …" link on
  Browse and Compare from lg (pages render the same `BackLink` below lg).
- Only the shell's `<main>` scrolls, and it is `relative` so absolutely positioned content
  (e.g. `sr-only` labels) stays inside it. Without that, such content is placed against the page
  and adds a second scrollbar. Keep `relative` on `<main>`.
- Page titles use `PageHeader`; titled boxes use `Panel` (`components/shared/Panel.tsx`).
- Dashboard and Browse use a 2/3 + 1/3 grid from `xl`. Compare scrolls horizontally inside its own
  area on narrow screens; the page itself never scrolls sideways.

Breakpoints are Tailwind's defaults; design mobile-first.

---

## Component patterns

### Ticket card (Browse)

Image area (`CircuitMap` for the ticket's zone) → ticket name (`displayBlock`, right-aligned) →
divider → red price (`TicketPrice`) opposite days and zone (`TicketFacts align="end"`) → view
description → the red **Compare** checkbox (`TicketCompareToggle`) and **View details**.
Compared cards keep a red border plus a 1px red ring (no layout shift) until unticked; other
cards turn red only for keyboard focus inside them (`has-focus-visible:`) and grey on hover.

The heading comes first in the DOM and is placed under the map with CSS `order`, so screen readers
meet the name before the map.

### Compare

A real `<table>` (column headers = ticket names) styled as equal-width cards with
`border-separate`. Rows that differ get `bg-gp-red-950` **and** a visible "Differs" label (colour is
never the only signal). Features use red-square bullets.

### Passes, race cards, upgrades

See `components/dashboard/`: `TicketCard` (red-bordered pass with QR placeholder), `RaceCard`
(red border when on-going), `UpgradesPanel`, `NextEventsPanel`.

---

## State patterns

Handle loading, error and empty in every data-fetching view.

- **Loading:** skeleton blocks in the same positions as the real content
  (`skeleton motion-safe:animate-shimmer`), or `LoadingSpinner` for small areas.
- **Error:** plain-language message and a red-outlined Retry, announced with `role="alert"`.
  Never show error codes, stack traces or raw messages (S3W1 rules). Route crashes use
  `RouteError` via `error.tsx`.
- **Empty:** `EmptyState` (red ring icon, display title, a way forward). Pass `announce` when the empty state replaces loaded content, so screen readers hear it.

---

## Icons

Use `lucide-react` and size with `size-*` classes only:

```tsx
<ChevronRight aria-hidden="true" className="size-4" /> // 16px, inline with text
<User aria-hidden="true" className="size-5" />         // 20px, icon buttons
```

Decorative icons get `aria-hidden="true"`; icon-only buttons need an `aria-label`.

---

## Forms

Forms use `react-hook-form` + `zod`, with the shared field styles:

```tsx
<div className="space-y-1.5">
  <label htmlFor="email" className={fieldLabel}>Email</label>
  <input id="email" type="email" className={fieldInput} aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined} {...register('email')} />
  {errors.email && <p id="email-error" role="alert" className={fieldError}>{errors.email.message}</p>}
</div>
<button type="submit" className={`${buttonPrimary} min-h-12 w-full`}>Sign in</button>
```

---

## Notifications (Toast)

Use `sonner` (`toast` from `sonner`) for user-facing feedback. The `<Toaster>` is mounted in
`src/providers/index.tsx`. Never use `alert()` or `confirm()`.

---

## Accessibility

- WCAG 2.1 AA, plus the team's 44px minimum touch target.
- Keyboard: every control is a real `<button>`, `<a>` or `<input>`, with the white `focusRing`.
- Style focus with `focus-visible:` (or `has-focus-visible:` on a container), not `focus:` or
  `focus-within:`. A mouse click also focuses buttons, so plain focus styles leave cards and
  controls looking selected until the user clicks elsewhere. Text inputs may use `focus:`.
- The accessible name contains the visible label (2.5.3): e.g. the checkbox labelled "Compare"
  has the name "Compare {ticket}", using an `sr-only` suffix.
- Status messages use `role="status"`; errors use `role="alert"`.
- Images need `alt` text; decorative SVGs and marks are `aria-hidden`.
- Motion: looping media has a pause control; animations use `motion-safe:`.

---

## Design import with Stitch MCP

When designs come from Google Stitch: "fetch the design tokens from my Stitch project" imports
tokens into `globals.css`. Review generated code against this file before committing. Set
`STITCH_API_KEY` in `.env` to enable the server.

---

## What to avoid

- CSS-in-JS, CSS modules or `style=` props
- Hex colours or palette names outside the tokens above (`gp-green-*`, `gp-gold-*` were removed)
- `zinc-500` or darker for text, and `gp-red-500` for small text
- Light surfaces or `dark:` variants
- Third-party component libraries (MUI, Ant Design, Chakra)
