# Ticket explorer

Open **Tickets** in the sidebar or **Browse tickets** on the dashboard.

- `/tickets` lists the signed-in user's readable `ticketType` documents from Firestore.
- Ticket types are ordered by price ascending, then name for tied prices.
- Each **View details** button opens a modal with the price in AUD, days covered,
  a zone indicator from the existing `zone` field, view description, included items,
  and excluded items. Close it with the close button, Escape, a backdrop click,
  or browser Back; the browse list and selection stay in place.
- Details have shareable URLs such as `/tickets?ticket=grandstand-turn-3-4-day`.
  Refreshing or opening a valid URL loads the same modal after the catalog loads.
  An unknown ID shows a ticket-not-found modal. Closing a direct link returns to
  the browse URL. No separate detail page is needed.
- The browse page and detail modal share one catalog request and handle loading, read failures with a
  retry button, and empty or missing tickets. Optional fields have neutral fallbacks.
- Add/remove controls and **Your selection** share state between the browse list
  and detail modal. Each ticket type can appear once; removing or clearing selections
  updates the list and modal. Select up to three ticket types for comparison;
  further add controls are visibly disabled until a ticket is removed. Selection
  is in memory and resets on a full reload, leaving
  the ticket explorer, or changing users. It does not reserve or purchase tickets.

The catalog must already be seeded in the configured Firebase project. See
[Firestore schema](FIRESTORE-SCHEMA.md#tickettype-collection) and the existing
`pnpm run seed:ticket-types` command. The app reads this collection; it never writes
ticket types or saves selections to Firestore.

Deploy `firebase/firestore.rules` to the same project used by the browser. Seeding
with the Admin SDK bypasses rules and does not grant browser access. Signed-in
users need the `ticketType` read rule; all client ticket writes remain denied.

The catalog uses `firebase/firestore/lite` for one-off REST reads. This avoids the
full SDK watch stream's `ca9` / `b815` failed-queue state. Retry starts a fresh
request; requests time out after 15 seconds and late results are ignored. Reload
the explorer to pick up catalog changes made while it is open.

The current dark surfaces and green accents are retained. The supplied mockups are
a reference for future visual work; checkout, quantities, and upgrades are outside
this browse/detail implementation.

Run `pnpm run test:component` for the mocked Firestore interaction tests, including
all six seed records, selection changes between the list and modal, read retries, missing data,
URL/history behavior, and authentication/request cleanup.

The zone indicator displays the stored zone label without inferring seat allocations
or coordinates. A venue map has not been supplied, so details explicitly show
"Zone map not available". See [T15 defect dispositions](T15-BROWSE-DETAIL-QA.md)
for the complete gap log and remaining data dependencies.
