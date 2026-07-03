'use client'

import * as React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
  showValue?: boolean
}

const sizeClasses = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0)

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index)
    }
  }

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const index = i + 1
          const filled = index <= Math.floor(displayRating)
          const partial = !filled && index === Math.ceil(displayRating)
          const partialPercentage = partial
            ? (displayRating % 1) * 100
            : 0

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className={cn(
                'relative transition-colors',
                interactive
                  ? 'cursor-pointer hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm'
                  : 'cursor-default'
              )}
              aria-label={`${index} stars`}
            >
              {/* Background star (empty) */}
              <Star
                className={cn(
                  sizeClasses[size],
                  'text-muted-foreground/30'
                )}
                fill="currentColor"
              />
              {/* Foreground star (filled) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: filled ? '100%' : partial ? `${partialPercentage}%` : '0%',
                }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    'text-yellow-500'
                  )}
                  fill="currentColor"
                />
              </div>
            </button>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// Rating breakdown component for detailed reviews
interface RatingBreakdownProps {
  professionalism?: number
  quality?: number
  communication?: number
  punctuality?: number
  value?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export function RatingBreakdown({
  professionalism,
  quality,
  communication,
  punctuality,
  value,
  size = 'sm',
}: RatingBreakdownProps) {
  const ratings = [
    { label: 'Professionalism', value: professionalism },
    { label: 'Quality', value: quality },
    { label: 'Communication', value: communication },
    { label: 'Punctuality', value: punctuality },
    { label: 'Value', value: value },
  ].filter((r) => r.value !== null && r.value !== undefined)

  if (ratings.length === 0) return null

  return (
    <div className="space-y-2">
      {ratings.map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="flex items-center gap-2">
            <StarRating rating={value!} size={size} />
            <span className="text-sm font-medium w-6">{value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Rating distribution component (for contractor profile)
interface RatingDistributionProps {
  distribution: { stars: number; count: number }[]
  totalReviews: number
}

export function RatingDistribution({
  distribution,
  totalReviews,
}: RatingDistributionProps) {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1)

  return (
    <div className="space-y-1">
      {distribution.map(({ stars, count }) => {
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
        const widthPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0

        return (
          <div key={stars} className="flex items-center gap-2">
            <span className="text-sm w-3">{stars}</span>
            <Star className="size-3 text-yellow-500" fill="currentColor" />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                style={{ width: `${widthPercentage}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-8 text-right">
              {count}
            </span>
          </div>
        )
      })}
    </div>
  )
}
