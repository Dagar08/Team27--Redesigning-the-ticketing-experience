# S3W1 - Circuit map in Browse and Compare

Date: 11 October 2026. Branch: `feature/circuit-map`, based on main `84402d5`.

## Checklist

- [x] Circuit map in the browse list: each ticket card uses its stored `zone`.
- [x] Circuit map in compare columns: the map row follows the selected ticket order.
- [x] Zone hover states: the zone overlay and labelled highlight button emphasize the zone.
- [x] Keyboard focus states: Tab focuses a native button with a visible outline and
      the same map emphasis. Enter or Space toggles a pinned highlight.
- [x] Component tests for rendering, accessibility, interactions and both integrations.

## Map and zone data

`CircuitMap` is shared by both ticket views. It uses the original
`docs/sprint-2-ui/week-3/Albert Park Circuit Map.png`, copied unchanged to
`frontend/public/maps/albert-park-circuit.png`. Labels and the image attribution
remain visible. The SVG uses a `1200 729` viewBox so overlays scale with the image.

`getCircuitZone` matches the existing zone field after trimming, collapsing spaces
and ignoring case. It never derives a zone from a ticket name, price or benefits.

| Zone                   | Representation                                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| General                | A frame around the circuit overview, with explicit roaming/no-fixed-seat text; this is not a lawn boundary                  |
| Turn 1 through Turn 14 | A ring around the corresponding numbered turn on the supplied schematic                                                     |
| Main Straight          | Approximate racing straight near the start/finish line                                                                      |
| Pit Straight           | A distinct approximate area near start/finish, with text stating that the schematic does not identify pit garages or suites |
| Blank/missing          | Base map and `Zone not specified`, without an invented highlight                                                            |
| Unrecognized           | Original zone text and `Map location unavailable for this zone`, without an invented highlight                              |

Positions are illustrative viewing areas, not confirmed seat or hospitality-suite
allocations. Named grandstands in the image are not automatically assigned to
seeded tickets. No Firestore schema or security-rule change is required.

## Interaction and accessibility

The ticket's zone has a persistent red outline (5.0:1 on the white map). Hover or focus adds a
thicker, dashed red outline with a red tint, and the visible status text identifies the
highlighted zone. (Restyled from green and gold to the mockup palette in S3W2.)
Leaving or blurring restores the baseline unless the user pins the highlight.

Only keyboard focus counts as focus emphasis. A mouse press or tap that focuses the button does
not, so after unpinning with a click the highlight clears as soon as the pointer leaves the map,
with no need to click elsewhere on the page. Touch has no hover state, so a tap never leaves a
stuck hover highlight (S3W2 fix).

The native highlight button has a minimum 44px target and `aria-pressed` for pinning.
Decorative SVG overlays are hidden from assistive technology; the labelled SVG,
zone description and button provide the accessible equivalent. Each map has unique
title/description/control IDs. Interaction state stays independent across cards and
columns and resets if the ticket zone changes. Highlighting never changes ticket
selection. An image-load failure shows a fallback and disables the highlight control.

The detail modal retains its existing zone badge. This task adds circuit maps to
Browse and Compare; exact seat maps and suite allocations remain unavailable.

## Verification

- `pnpm run test:component`: 51 tests passed across 4 files, including 20 new map tests.
- `pnpm run lint` and `pnpm run typecheck`: passed across both packages.
- `pnpm run test`: all 5 backend tests passed.
- `pnpm run build`: passed with Browse and Compare compiled on Next.js 16.3.8.
- After the scoped Tinypool patch, frontend and backend tests also passed with
  `--pool=threads` (the default forks pool passed above).
- Isolated browser checks: all 15 passed in Microsoft Edge 155.0.4283.45 at
  375px, 768px and 1280px. No uncaught browser errors occurred.

The component tests cover all six seeded records, normalized zone matching, missing
and unknown zones, pointer/keyboard feedback, pinning, independent state and ARIA IDs,
zone changes, image failure, every browse card and ordered compare columns.

Browser checks used the actual components, ticket provider and dashboard shell with
the production CSS and public PNG. Authentication, seed reads and Next routing were
mocked; this does not establish live Firebase behavior or production deployment.
Checks confirmed pointer hit-testing at the Turn 3 marker's center, a visible 2px
keyboard outline, Enter pin/unpin, independent map state, distinct main/pit areas,
44px controls, fallbacks, and the existing mobile detail modal. Browse has no
horizontal overflow; Compare confines horizontal scrolling to its table at small
widths. Desktop and mobile screenshots were visually reviewed. The temporary server
and browser were closed after verification.

## Dependency audit follow-up

The map feature adds no dependencies. Main's existing dependency tree initially
reported six high and three critical findings. Available security patches are kept
in a separate commit: Next.js/eslint-config-next 16.3.8, sharp 0.35.5,
@fastify/busboy 3.2.2, source-map-js 1.2.2, proxy-addr 2.0.8 and a Vitest-scoped
Tinypool 2.1.2 override. Tinypool 2 drops Node 18; this workspace and CI use Node 22+.
The tests in both pool modes verify the API compatibility used by this repository.

`pnpm audit --audit-level=high` still fails on one pre-existing development-only
`braces@3.0.3` finding in the ESLint chain
([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)). The
registry has no patched release: 3.0.3 is the latest published version and GitHub
reports no patched version. Nine moderate findings remain; no critical findings
remain. The security scan is a review blocker pending an upstream patch, not a
waiver. No CI workflow or audit threshold was changed.

## Handoff

The source image is illustrative. Product/design should approve coordinates and
supply a precise seat/suite map before exact allocations can be claimed. New zone
labels need an explicit entry in `circuitZones.ts`; unrecognized labels currently
fall back safely. The map uses the existing catalog read and makes no client writes.
