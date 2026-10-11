# Firestore Schema

## Overview

All collections use the typed collection pattern — see `frontend/src/lib/firebase/firestore.ts`.
Security rules are in `firebase/firestore.rules`.

When adding a new collection, use the `/firebase-collection` Claude Code skill.

## Schema versioning

Every document in every collection **must** include a `_schemaVersion` field:

```typescript
_schemaVersion: 1  // increment when doing a breaking schema change
```

This enables **lazy migration** — when a document is read, check `_schemaVersion` and migrate on the fly if it's behind current. See the `/evolve-schema` skill for the full migration workflow.

**Rules:**
- `_schemaVersion` is always `1` on creation
- Non-breaking changes (adding optional fields with defaults) keep the same version
- Breaking changes (rename, remove, type change) increment the version and require a migration function
- Never remove `_schemaVersion` from a schema

---

## `users` collection

**Path:** `/users/{userId}`
**Access:** Owner-only (user can read/write their own document; admins can read all)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | `string` | Yes | Firebase Auth UID (same as document ID) |
| `email` | `string` | Yes | User's email address |
| `displayName` | `string \| null` | Yes | Display name from Auth or profile |
| `photoURL` | `string \| null` | Yes | Profile photo URL |
| `role` | `'user' \| 'admin'` | Yes | User role — immutable by user after creation |
| `createdAt` | `Timestamp` | Yes | When the document was created |
| `updatedAt` | `Timestamp` | Yes | When the document was last updated |
| `_schemaVersion` | `1` | Yes | Schema version for lazy migration |

**Creation:** Auto-created by `AuthProvider` on first sign-in via `syncUserProfile()`.
**Deletion:** Hard-delete is disabled in security rules. Use `deletedAt` field for soft-delete.

---

## `ticketType` collection

**Path:** `/ticketType/{ticketTypeId}`
**Access:** Read for any signed-in user. **All client writes denied** — this is reference data.

Backs the ticket explorer's browse, detail and compare screens. Deliberately flat: one
collection, no relationships, no joins, no user-owned data. See
`T8 — Ticket Data Structure` design doc.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Firestore document ID, mirrored onto the document |
| `name` | `string` | Yes | e.g. `"Grandstand — Turn 3, 4 day"` |
| `daysCovered` | `string[]` | Yes | e.g. `["Thu","Fri","Sat","Sun"]` |
| `zone` | `string` | Yes | Where at the circuit, e.g. `"Turn 3"` |
| `priceAud` | `number` | Yes | Price in AUD |
| `viewDescription` | `string` | No | One line on what you can see from there |
| `includes` | `string[]` | No | What the ticket covers |
| `excludes` | `string[]` | No | What it does not cover |
| `_schemaVersion` | `1` | Yes | Schema version for lazy migration |

**Creation:** Seeded from `firebase/seed/ticket-types.json` via `pnpm run seed:ticket-types`
(uses the Admin SDK, which bypasses security rules), or entered by hand in the Firebase console.
The app never writes to this collection.
**Deletion:** Not possible from the client. Remove documents in the console if needed.

---

<!-- Add new collection schemas below using the /firebase-collection skill -->