// Robust price parser for values like:
// "€10M - €14.5M", "€850K", "€7.2m", "£1.2M", "500k", "Free", "-"
// Returns numeric value in base currency units (euros/pounds treated the same scale),
// using the upper bound when a range is present. Unknown values map to Infinity.

const DASH_REGEX = /[\-–—]/ // hyphen, en dash, em dash

function parseSingleAmount(raw: string): number {
  const s = raw
    .replace(/[^0-9a-zA-Z.]/g, '') // drop currency symbols and separators, keep digits, letters, dot
    .toLowerCase()
    .trim()

  // Support suffix multipliers
  const m = s.match(/^([0-9]*\.?[0-9]+)\s*([kmb])?$/i)
  if (m) {
    const num = parseFloat(m[1])
    const suffix = (m[2] || '').toLowerCase()
    if (!suffix) return isNaN(num) ? Number.POSITIVE_INFINITY : num
    if (suffix === 'k') return num * 1_000
    if (suffix === 'm') return num * 1_000_000
    if (suffix === 'b') return num * 1_000_000_000
  }

  // Fallback: try raw number
  const n = parseFloat(s)
  if (!isNaN(n)) return n
  return Number.POSITIVE_INFINITY
}

export function parsePriceToNumber(input: string | number | null | undefined): number {
  if (typeof input === 'number') return input
  if (!input) return Number.POSITIVE_INFINITY

  const value = String(input).trim()
  if (!value || value === '-' || value === '–') return Number.POSITIVE_INFINITY
  if (/free/i.test(value)) return 0

  // Normalize dashes to split ranges
  const normalized = value.replace(/[€,£,$]/g, '').replace(/\s+/g, '')
  const parts = normalized.split(DASH_REGEX)

  if (parts.length > 1) {
    // Use the upper bound for filtering by max price
    const nums = parts.map(parseSingleAmount).filter((n) => isFinite(n))
    if (nums.length === 0) return Number.POSITIVE_INFINITY
    return Math.max(...nums)
  }

  return parseSingleAmount(normalized)
}

export function formatMillions(amount: number): string {
  if (!isFinite(amount)) return ''
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(2)}B`
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`
  return String(amount)
}

