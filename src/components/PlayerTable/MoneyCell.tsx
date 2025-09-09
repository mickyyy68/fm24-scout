import { Badge } from '@/components/ui/badge'
import { parsePriceToNumber } from '@/lib/price'

type MoneyCellProps = {
  raw: string | number | null | undefined
  title?: string
  /** Optional small suffix displayed to the right (e.g., "p/a") */
  suffix?: string
}

// Extract the first currency symbol we find; fall back to €
function detectCurrencySymbol(input: string): string {
  const m = input.match(/[€£$]/)
  return m ? m[0] : '€'
}

function formatCompact(amount: number, currency = 'EUR'): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    // Fallback: just show millions/k
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(2)}B`
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`
    return String(amount)
  }
}

export function MoneyCell({ raw, title, suffix }: MoneyCellProps) {
  if (raw == null || raw === '') return null
  const value = String(raw)

  // Special case: Not for Sale
  if (/not\s*for\s*sale/i.test(value)) {
    return (
      <div className="flex justify-end">
        <Badge variant="secondary" className="font-normal">Not for Sale</Badge>
      </div>
    )
  }

  const currencySymbol = detectCurrencySymbol(value)
  // Map symbol to ISO code for Intl
  const symbolToISO: Record<string, string> = { '€': 'EUR', '£': 'GBP', '$': 'USD' }
  const iso = symbolToISO[currencySymbol] || 'EUR'

  // Normalize dashes and split any ranges
  const parts = value.split(/[\-–—]/).map((p) => p.trim()).filter(Boolean)

  const formatted = parts.map((part) => {
    const n = parsePriceToNumber(part)
    if (!isFinite(n)) return ''
    return formatCompact(n, iso)
  }).filter(Boolean)

  const display = formatted.join(' – ')

  return (
    <div className="flex items-baseline justify-end gap-1 whitespace-nowrap truncate" title={title ?? value}>
      <span className="tabular-nums">{display}</span>
      {suffix ? (
        <span className="text-[11px] text-muted-foreground">{suffix}</span>
      ) : null}
    </div>
  )
}

export default MoneyCell
