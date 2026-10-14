/**
 * Shared class strings for the mockup design language (see docs/DESIGN.md).
 * Colour tokens live in app/globals.css.
 */

/** Wide Archivo, the base of every display style. */
const display = 'font-display font-stretch-expanded tracking-tight'

/** Heavy italic uppercase for page and section titles ("YOUR TICKETS"). */
export const displayTitle = `${display} font-extrabold italic uppercase`

/** Heavy italic in title case ("Australian Grand Prix" on cards and passes). */
export const displayItalic = `${display} font-extrabold italic`

/** Black upright uppercase for ticket names ("MAIN GRANDSTAND"). */
export const displayBlock =
  'font-display font-stretch-semi-expanded font-black uppercase tracking-tight'

/** White outline: high contrast on dark surfaces and red fills alike. */
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

const buttonBase = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`

/** Filled red call to action ("VIEW EVENT", "SIGN IN"). */
export const buttonPrimary = `${buttonBase} bg-gp-red-500 text-white hover:bg-gp-red-600 active:bg-gp-red-600`

/** Red outline ("VIEW DETAILS", "RETRY", "CREATE ACCOUNT"). */
export const buttonOutline = `${buttonBase} border border-gp-red-500 text-white hover:bg-gp-red-500/15 active:bg-gp-red-500/25`

/** Neutral outline for secondary actions ("Remove", "Clear selection"). */
export const buttonSecondary = `${buttonBase} border border-asphalt-600 text-white hover:bg-white/5 active:bg-white/10`

/** Card and panel surface. The border meets 3:1 non-text contrast (Colour Contrast Audit). */
export const panel = 'rounded-2xl border border-asphalt-600 bg-asphalt-900'

/** Red link inside running text; inherits the surrounding size. */
export const inlineLink = `rounded-sm font-semibold text-gp-red-400 underline underline-offset-2 hover:text-white ${focusRing}`

/** Small red text link ("view all upgrades"). */
export const textLink = `${inlineLink} text-xs`

/** Small red italic label above a heading ("RACE WEEK ACCESS"). */
export const eyebrow =
  'font-display text-xs font-extrabold italic uppercase tracking-wide text-gp-red-400'

/** Form label, bold italic as in the checkout mockup. */
export const fieldLabel = 'font-display text-sm font-bold italic text-white'

/** Red-bordered input from the checkout mockup: 4.0:1 border and a white focus ring. */
export const fieldInput =
  'min-h-11 w-full rounded-lg border border-gp-red-500 bg-asphalt-950 px-3 py-2.5 text-sm text-white transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-white focus:outline-none aria-invalid:border-2 aria-invalid:border-gp-red-400'

export const fieldError = 'text-xs font-semibold text-gp-red-400'
