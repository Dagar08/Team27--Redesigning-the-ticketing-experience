import type { Timestamp } from 'firebase/firestore'

/**
 * Firestore collection type definitions.
 *
 * Keep in sync with:
 *   - src/lib/firebase/firestore.ts  (typed collection exports)
 *   - firebase/firestore.rules       (security rules)
 *   - docs/FIRESTORE-SCHEMA.md       (schema documentation)
 *
 * When adding a new collection, use the /firebase-collection skill.
 */

export interface UserProfile {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  role: 'user'
  createdAt: Timestamp
  updatedAt: Timestamp
  _schemaVersion: 1
}

export type CreateUserProfileInput = Omit<UserProfile, 'createdAt' | 'updatedAt'>

/**
 * Reference data for the ticket explorer (browse / detail / compare screens).
 *
 * Read-only from the app, seeded by hand from the Firebase console. No
 * user-owned data, no relationships, no joins. See docs/FIRESTORE-SCHEMA.md.
 */
export interface TicketType {
  /** Firestore document id, mirrored onto the document for convenience. */
  id: string
  /** e.g. "Grandstand — Turn 3, 4 day" */
  name: string
  /** e.g. ["Thu", "Fri", "Sat", "Sun"] */
  daysCovered: string[]
  /** Where at the circuit, e.g. "Turn 3" */
  zone: string
  priceAud: number
  /** One line on what you can see from there. */
  viewDescription?: string
  /** What the ticket covers. */
  includes?: string[]
  /** What the ticket does not cover. */
  excludes?: string[]
  _schemaVersion: 1
}