# Ticket explorer

Open **Tickets** in the sidebar or **Browse tickets** on the dashboard.

- `/tickets` lists the signed-in user's readable `ticketType` documents from Firestore.
- Each **View details** button opens a modal with the price in AUD, days covered,
  zone, view description, included items, and excluded items. Close it with the
  close button or Escape; the browse list stays in place.
- The browse page and detail modal share one catalog request and handle loading, read failures with a
  retry button, and empty or missing tickets. Optional fields have neutral fallbacks.
- Add/remove controls and **Your selection** share state between the browse list
  and detail modal. Each ticket type can appear once; removing or clearing selections
  updates the list and modal. Selection is in memory and resets on a full reload, leaving
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
and authentication/request cleanup.
