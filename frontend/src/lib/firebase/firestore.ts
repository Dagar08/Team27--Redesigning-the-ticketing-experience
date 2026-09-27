import { collection, doc, type CollectionReference, type DocumentData } from 'firebase/firestore'
import {
  collection as restCollection,
  doc as restDoc,
  getFirestore as getRestFirestore,
  type CollectionReference as RestCollectionReference,
} from 'firebase/firestore/lite'
import { getClientApp, getClientDb } from './client'
import type { UserProfile, TicketType } from '@/types/firestore'

/**
 * Creates a typed Firestore collection reference.
 * Use this factory to add new collections — see docs/FIRESTORE-SCHEMA.md
 */
function typedCollection<T extends DocumentData>(path: string): CollectionReference<T> {
  return collection(getClientDb(), path) as CollectionReference<T>
}

// ── Collections ──────────────────────────────────────────────────────────────
// Add one export per Firestore collection. Keep in sync with:
//   - src/types/firestore.ts
//   - firebase/firestore.rules
//   - docs/FIRESTORE-SCHEMA.md

export function getUsersCollection() {
  return typedCollection<UserProfile>('users')
}

export function userDoc(uid: string) {
  return doc(getUsersCollection(), uid)
}

/**
 * Ticket explorer reference data. Read-only from the app, rules deny all
 * client writes, so there is no create/update accessor here by design.
 */
export function getTicketTypesCollection() {
  // Seeded reference data only needs one-off reads. Lite uses REST and avoids
  // the full SDK's watch stream / AsyncQueue, including ca9/b815 failures.
  return restCollection(
    getRestFirestore(getClientApp()),
    'ticketType'
  ) as RestCollectionReference<TicketType>
}

export function ticketTypeDoc(id: string) {
  return restDoc(getTicketTypesCollection(), id)
}
