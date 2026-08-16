/**
 * Team feature data model.
 *
 * Static, read-only content (no Firestore collection needed) — team
 * membership doesn't change at runtime, so it's defined directly in
 * `data.ts` rather than fetched. Add a Firestore-backed collection instead
 * if this ever needs to be editable without a redeploy.
 */
export interface TeamMember {
  /** Stable slug used as the React key and for future deep-linking. */
  id: string
  name: string
  role: string
  /** One or two sentence bio. */
  blurb: string
  /** Path under /public, e.g. '/team/jane-doe.jpg'. Falls back to initials if omitted. */
  photoUrl?: string
}
