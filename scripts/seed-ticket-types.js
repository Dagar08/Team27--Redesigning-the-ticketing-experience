#!/usr/bin/env node
/**
 * Seeds the `ticketType` collection from firebase/seed/ticket-types.json.
 *
 * Security rules deny all client writes to this collection, so it must be
 * seeded with the Admin SDK (which bypasses rules) or by hand in the console.
 * This script is the repeatable version of doing it by hand.
 *
 * Usage (from the repo root):
 *   pnpm run seed:ticket-types
 *
 * Idempotent: documents are written by id, so re-running updates in place
 * rather than creating duplicates.
 */

const { readFileSync, existsSync } = require('node:fs')
const { join } = require('node:path')
const { createRequire } = require('node:module')

const ROOT = join(__dirname, '..')
const COLLECTION = 'ticketType'

// firebase-admin is a workspace dependency (backend/), not a root one, and
// Node resolves from this file's location — so resolve it explicitly.
function loadFirebaseAdmin() {
  const backendPkg = join(ROOT, 'backend', 'package.json')
  if (!existsSync(join(ROOT, 'backend', 'node_modules'))) {
    console.error('backend dependencies not installed. Run `pnpm install` first.')
    process.exit(1)
  }
  const req = createRequire(backendPkg)
  return {
    app: req('firebase-admin/app'),
    firestore: req('firebase-admin/firestore'),
  }
}

// Minimal .env reader — avoids adding dotenv just for this script.
function loadEnv() {
  const envPath = join(ROOT, '.env')
  if (!existsSync(envPath)) {
    console.error('No .env found at the repo root. Copy .env.example and fill it in.')
    process.exit(1)
  }
  const env = {}
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

async function main() {
  const env = loadEnv()
  const key = env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
  const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  if (!key) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is not set in .env')
    process.exit(1)
  }

  const { app, firestore } = loadFirebaseAdmin()

  if (app.getApps().length === 0) {
    app.initializeApp({
      credential: app.cert(JSON.parse(Buffer.from(key, 'base64').toString('utf8'))),
      projectId,
    })
  }

  const db = firestore.getFirestore()
  const seedPath = join(ROOT, 'firebase', 'seed', 'ticket-types.json')
  const ticketTypes = JSON.parse(readFileSync(seedPath, 'utf8'))

  const batch = db.batch()
  for (const ticketType of ticketTypes) {
    batch.set(db.collection(COLLECTION).doc(ticketType.id), ticketType)
  }
  await batch.commit()

  console.log(`Seeded ${ticketTypes.length} documents into ${COLLECTION}:`)
  for (const t of ticketTypes) console.log(`  - ${t.id}`)
}

main().catch((error) => {
  console.error('Seeding failed:', error.message)
  process.exit(1)
})