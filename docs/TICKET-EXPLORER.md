# Ticket explorer

Open **Tickets** in the sidebar (or the mobile tab bar) or **View event** on the dashboard.

- `/tickets` lists the signed-in user's readable `ticketType` documents from Firestore.
- Ticket types are ordered by price ascending, then name for tied prices.
- Every browse card includes the supplied Albert Park circuit schematic with its
  stored zone highlighted. Compare shows the same map in each ticket column.
  Hover the zone or its **Highlight zone** button for emphasis. Tab to the button
  for the same emphasis and a visible focus outline; Enter, Space, a click or a tap pins/unpins it.
  Once unpinned, the highlight clears as soon as the pointer leaves the map.
  Map interactions do not add, remove, or change a ticket selection.
- Each **View details** button opens a modal with the price in AUD, days covered,
  a zone indicator from the existing `zone` field, view description, included items,
  and excluded items. Close it with the close button, Escape, a backdrop click,
  or browser Back; the browse list and selection stay in place.
- Details have shareable URLs such as `/tickets?ticket=grandstand-turn-3-4-day`.
  Refreshing or opening a valid URL loads the same modal after the catalog loads.
  An unknown ID shows a ticket-not-found modal. Closing a direct link returns to
  the browse URL. No separate detail page is needed.
- Browse, the detail modal and Compare share one catalog request and handle loading, read failures with a
  retry button, and empty or missing tickets. Optional fields have neutral fallbacks.
  See [S3W2 error and empty-state hardening](S3W2-ERROR-HARDENING.md) for how the code maps to the S3W1 acceptance criteria (ERR, EMP, FS, A11Y).
- The red **Compare** checkbox (on each card and in the detail modal) and **Your selection**
  share state between the browse list and detail modal. Each ticket type can appear once; removing or clearing selections
  updates the list and modal. Select up to three ticket types for comparison;
  further Compare checkboxes are disabled, with "Selection limit reached", until a ticket is removed.
  Every compared ticket's card is outlined in red on Browse until it is unticked or removed. Selection
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
request; requests time out after 10 seconds (ERR-01, FS-02) and late results are ignored. Reload
the explorer to pick up catalog changes made while it is open.

Screens follow the approved red-and-black mockups; see the [design system](DESIGN.md) and the
[S3W2 mockup restyle](S3W2-MOCKUP-RESTYLE.md). Checkout, quantities and add-to-cart remain
outside this browse/detail implementation.

Run `pnpm run test:component` for the mocked Firestore interaction tests, including
all six seed records, selection changes between the list and modal, read retries, missing data,
URL/history behavior, and authentication/request cleanup.

The detail modal's zone indicator displays the stored zone label. Browse and Compare
now show approximate viewing areas on the supplied schematic. General admission
shows circuit-wide roaming context rather than a fixed seat. Unknown zones keep
their label and the base map without a guessed location. No seat allocation or exact
pit suite is inferred. See [S3W1 map integration](S3W1-CIRCUIT-MAP.md) for the mapping
and interaction contract, and [T15 defect dispositions](T15-BROWSE-DETAIL-QA.md) for
the earlier gap log and remaining data dependencies.
