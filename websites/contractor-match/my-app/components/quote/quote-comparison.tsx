'use client'

import * as React from 'react'
import { Check, X, ArrowUpDown, Building2, Clock, DollarSign, Star } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StarRating } from '@/components/ui/star-rating'
import type { QuoteData } from './quote-card'

interface QuoteComparisonProps {
  quotes: QuoteData[]
  onSelectQuote?: (quoteId: string) => void
  onAcceptQuote?: (quoteId: string) => void
  onRejectQuote?: (quoteId: string) => void
  className?: string
}

type SortField = 'price' | 'timeline' | 'rating' | 'date'
type SortOrder = 'asc' | 'desc'

export function QuoteComparison({
  quotes,
  onSelectQuote,
  onAcceptQuote,
  onRejectQuote,
  className,
}: QuoteComparisonProps) {
  const [sortField, setSortField] = React.useState<SortField>('price')
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc')
  const [selectedQuotes, setSelectedQuotes] = React.useState<Set<string>>(new Set())

  const calculateTotal = (quote: QuoteData) => {
    let total = 0
    if (quote.price_type === 'hourly') {
      total = (quote.estimated_hours || 0) * (quote.hourly_rate || 0)
    } else {
      total = quote.price || 0
    }
    if (quote.materials_included) {
      total += quote.materials_cost || 0
    }
    return total
  }

  const sortedQuotes = React.useMemo(() => {
    return [...quotes].sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'price':
          comparison = calculateTotal(a) - calculateTotal(b)
          break
        case 'timeline':
          comparison = (a.timeline_days || 0) - (b.timeline_days || 0)
          break
        case 'rating':
          comparison = (a.contractor?.rating_avg || 0) - (b.contractor?.rating_avg || 0)
          break
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [quotes, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const toggleQuoteSelection = (quoteId: string) => {
    setSelectedQuotes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(quoteId)) {
        newSet.delete(quoteId)
      } else {
        newSet.add(quoteId)
      }
      return newSet
    })
  }

  const features = [
    { key: 'contractor', label: 'Contractor', icon: Building2 },
    { key: 'price', label: 'Total Price', icon: DollarSign },
    { key: 'timeline', label: 'Timeline', icon: Clock },
    { key: 'rating', label: 'Rating', icon: Star },
    { key: 'materials', label: 'Materials' },
    { key: 'verified', label: 'Verified' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Compare Quotes</CardTitle>
            <CardDescription>
              Compare {quotes.length} quotes side by side
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('price')}
              className={cn(sortField === 'price' && 'bg-muted')}
            >
              <DollarSign className="size-4 mr-1" />
              Price
              {sortField === 'price' && (
                <ArrowUpDown className={cn('size-3 ml-1', sortOrder === 'desc' && 'rotate-180')} />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('timeline')}
              className={cn(sortField === 'timeline' && 'bg-muted')}
            >
              <Clock className="size-4 mr-1" />
              Time
              {sortField === 'timeline' && (
                <ArrowUpDown className={cn('size-3 ml-1', sortOrder === 'desc' && 'rotate-180')} />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-7 gap-4 pb-3 border-b font-medium text-sm">
              <div>Contractor</div>
              <div className="cursor-pointer" onClick={() => toggleSort('price')}>
                Total Price {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
              <div className="cursor-pointer" onClick={() => toggleSort('timeline')}>
                Timeline {sortField === 'timeline' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
              <div className="cursor-pointer" onClick={() => toggleSort('rating')}>
                Rating {sortField === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
              <div>Materials</div>
              <div>Verified</div>
              <div>Actions</div>
            </div>

            {/* Data Rows */}
            <div className="space-y-2 mt-2">
              {sortedQuotes.map((quote) => {
                const total = calculateTotal(quote)
                const isSelected = selectedQuotes.has(quote.id)
                const isLowestPrice = total === Math.min(...quotes.map(calculateTotal))
                const isFastest = quote.timeline_days === Math.min(...quotes.map(q => q.timeline_days || Infinity))
                const isHighestRated = (quote.contractor?.rating_avg || 0) === Math.max(...quotes.map(q => q.contractor?.rating_avg || 0))

                return (
                  <div
                    key={quote.id}
                    className={cn(
                      'grid grid-cols-7 gap-4 py-3 px-2 rounded-lg transition-colors',
                      isSelected ? 'bg-primary/5' : 'hover:bg-muted/50',
                      'cursor-pointer'
                    )}
                    onClick={() => toggleQuoteSelection(quote.id)}
                  >
                    {/* Contractor */}
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="size-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {quote.contractor?.company_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {quote.contractor?.years_in_business} years
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <p className={cn('font-semibold', isLowestPrice && 'text-green-600')}>
                        ${total.toLocaleString()}
                        {isLowestPrice && <Badge className="ml-2 bg-green-100 text-green-700 text-xs">Lowest</Badge>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {quote.price_type === 'hourly' 
                          ? `$${quote.hourly_rate}/hr` 
                          : 'Fixed price'}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <p className={cn('font-medium', isFastest && 'text-blue-600')}>
                        {quote.timeline_days} days
                        {isFastest && <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">Fastest</Badge>}
                      </p>
                      {quote.start_date && (
                        <p className="text-xs text-muted-foreground">
                          Starts {new Date(quote.start_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Rating */}
                    <div>
                      <div className="flex items-center gap-1">
                        <StarRating 
                          rating={quote.contractor?.rating_avg || 0} 
                          size="xs" 
                        />
                        {isHighestRated && <Badge className="ml-1 bg-yellow-100 text-yellow-700 text-xs">Top</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {quote.contractor?.rating_avg.toFixed(1)} / 5.0
                      </p>
                    </div>

                    {/* Materials */}
                    <div>
                      {quote.materials_included ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="size-4" />
                          <span className="text-sm">Included</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <X className="size-4" />
                          <span className="text-sm">Not included</span>
                        </div>
                      )}
                    </div>

                    {/* Verification */}
                    <div className="flex flex-wrap gap-1">
                      {quote.contractor?.insurance_verified && (
                        <Badge variant="outline" className="text-xs text-green-600">Insurance</Badge>
                      )}
                      {quote.contractor?.background_check_passed && (
                        <Badge variant="outline" className="text-xs text-green-600">Background</Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      {quote.status === 'submitted' && (
                        <>
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              onAcceptQuote?.(quote.id)
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRejectQuote?.(quote.id)
                            }}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {quotes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No quotes received yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Compact comparison view for mobile
interface QuoteComparisonCompactProps {
  quotes: QuoteData[]
  onSelectQuote?: (quoteId: string) => void
  className?: string
}

export function QuoteComparisonCompact({
  quotes,
  onSelectQuote,
  className,
}: QuoteComparisonCompactProps) {
  const calculateTotal = (quote: QuoteData) => {
    let total = 0
    if (quote.price_type === 'hourly') {
      total = (quote.estimated_hours || 0) * (quote.hourly_rate || 0)
    } else {
      total = quote.price || 0
    }
    if (quote.materials_included) {
      total += quote.materials_cost || 0
    }
    return total
  }

  const lowestPrice = Math.min(...quotes.map(calculateTotal))
  const fastestTime = Math.min(...quotes.map(q => q.timeline_days || Infinity))
  const highestRating = Math.max(...quotes.map(q => q.contractor?.rating_avg || 0))

  return (
    <div className={cn('space-y-3', className)}>
      {quotes.map((quote) => {
        const total = calculateTotal(quote)
        const isLowestPrice = total === lowestPrice
        const isFastest = quote.timeline_days === fastestTime
        const isHighestRated = (quote.contractor?.rating_avg || 0) === highestRating

        return (
          <Card
            key={quote.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectQuote?.(quote.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{quote.contractor?.company_name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <StarRating rating={quote.contractor?.rating_avg || 0} size="xs" />
                    <span>({quote.contractor?.rating_avg.toFixed(1)})</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('font-bold', isLowestPrice && 'text-green-600')}>
                    ${total.toLocaleString()}
                  </p>
                  {isLowestPrice && (
                    <Badge className="bg-green-100 text-green-700 text-xs">Best Price</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">
                  {quote.timeline_days} days
                  {isFastest && ' (fastest)'}
                </Badge>
                {quote.materials_included && (
                  <Badge variant="secondary" className="text-xs">
                    Materials incl.
                  </Badge>
                )}
                {isHighestRated && (
                  <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                    Top Rated
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
