import { PlayerStatus, STATUS_COLORS } from '@/types/squad'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart,  // Bought
  FileText,      // Loan
  TestTube,      // Trial
  Baby           // Youth
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlayerStatusBadgeProps {
  status: PlayerStatus
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const statusIcons = {
  bought: ShoppingCart,
  loan: FileText,
  trial: TestTube,
  youth: Baby
}

const statusLabels = {
  bought: 'Bought',
  loan: 'Loan',
  trial: 'Trial',
  youth: 'Youth'
}

export function PlayerStatusBadge({ 
  status, 
  size = 'md', 
  showLabel = true,
  className 
}: PlayerStatusBadgeProps) {
  const Icon = statusIcons[status]
  const label = statusLabels[status]
  const colors = STATUS_COLORS[status]
  
  const sizeClasses = {
    sm: 'text-xs h-5',
    md: 'text-sm h-6',
    lg: 'text-base h-7'
  }
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1',
        sizeClasses[size],
        className
      )}
      style={{
        borderColor: colors.border,
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{label}</span>}
    </Badge>
  )
}