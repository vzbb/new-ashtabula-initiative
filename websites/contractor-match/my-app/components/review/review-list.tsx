'use client'

import * as React from 'react'
import { Star, Filter, SortAsc, SortDesc, MessageSquare } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ReviewCard, CompactReviewCard, type Review } from './review-card'
import { StarRating, RatingDistribution } from '@/components/ui/star-rating'

interface ReviewListProps {
  reviews: Review[]
  title?: string
  showStats?: boolean
  showFilters?: boolean
  emptyMessage?: string
  onHelpful?: (reviewId: string) => void
  onFlag?: (reviewId: string) => void
  onReply?: (reviewId: string) => void
  onReviewClick?: (review: Review) => void
  className?: string
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
type FilterOption = 'all' | 'verified' | 'positive' | 'critical'

export function ReviewList({
  reviews,
  title = 'Reviews',
  showStats = true,
  showFilters = true,
  emptyMessage = 'No reviews yet',
  onHelpful,
  onFlag,
  onReply,
  onReviewClick,
  className,
}: ReviewListProps) {
  const [sortBy, setSortBy] = React.useState<SortOption>('newest')
  const [filterBy, setFilterBy] = React.useState<FilterOption>('all')

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = reviews.length
    if (total === 0) {
      return {
        average: 0,
        total,
        distribution: [
          { stars: 5, count: 0 },
          { stars: 4, count: 0 },
          { stars: 3, count: 0 },
          { stars: 2, count: 0 },
          { stars: 1, count: 0 },
        ],
        recommendPercentage: 0,
      }
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    const average = sum / total

    const distribution = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: reviews.filter((r) => r.rating === stars).length,
    }))

    const recommendCount = reviews.filter(
      (r) => r.would_recommend === true
    ).length
    const recommendPercentage = Math.round((recommendCount / total) * 100)

    return {
      average,
      total,
      distribution,
      recommendPercentage,
    }
  }, [reviews])

  // Filter and sort reviews
  const filteredAndSortedReviews = React.useMemo(() => {
    let filtered = [...reviews]

    // Apply filters
    switch (filterBy) {
      case 'verified':
        filtered = filtered.filter((r) => r.verified_hire)
        break
      case 'positive':
        filtered = filtered.filter((r) => r.rating >= 4)
        break
      case 'critical':
        filtered = filtered.filter((r) => r.rating <= 2)
        break
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        case 'helpful':
          return b.helpful_count - a.helpful_count
        default:
          return 0
      }
    })

    return filtered
  }, [reviews, sortBy, filterBy])

  if (reviews.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{emptyMessage}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Be the first to leave a review after completing a project together.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Stats */}
      {showStats && stats.total > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Rating */}
              <div className="flex flex-col items-center justify-center md:items-start">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">
                    {stats.average.toFixed(1)}
                  </span>
                  <span className="text-lg text-muted-foreground">/ 5</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={stats.average} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2">
                <RatingDistribution
                  distribution={stats.distribution}
                  totalReviews={stats.total}
                />
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {stats.recommendPercentage}% would recommend
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {reviews.filter((r) => r.verified_hire).length} verified {reviews.filter((r) => r.verified_hire).length === 1 ? 'hire' : 'hires'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
            <TabsList className="h-9">
              <TabsTrigger value="all" className="text-xs">
                All ({reviews.length})
              </TabsTrigger>
              <TabsTrigger value="verified" className="text-xs">
                Verified ({reviews.filter((r) => r.verified_hire).length})
              </TabsTrigger>
              <TabsTrigger value="positive" className="text-xs">
                Positive ({reviews.filter((r) => r.rating >= 4).length})
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-xs">
                Critical ({reviews.filter((r) => r.rating <= 2).length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <div className="flex items-center gap-1">
              <Button
                variant={sortBy === 'newest' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('newest')}
                className="h-8 text-xs"
              >
                Newest
              </Button>
              <Button
                variant={sortBy === 'highest' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('highest')}
                className="h-8 text-xs"
              >
                Highest
              </Button>
              <Button
                variant={sortBy === 'lowest' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('lowest')}
                className="h-8 text-xs"
              >
                Lowest
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Count */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {filterBy === 'all' ? 'All Reviews' : `${filterBy.charAt(0).toUpperCase() + filterBy.slice(1)} Reviews`}
        </h3>
        <span className="text-sm text-muted-foreground">
          {filteredAndSortedReviews.length} of {reviews.length}
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onHelpful={onHelpful}
            onFlag={onFlag}
            onReply={onReply}
          />
        ))}
      </div>

      {filteredAndSortedReviews.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No reviews match the selected filter.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterBy('all')}
              className="mt-2"
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Compact Review List for Sidebars
interface CompactReviewListProps {
  reviews: Review[]
  maxReviews?: number
  onReviewClick?: (review: Review) => void
  className?: string
}

export function CompactReviewList({
  reviews,
  maxReviews = 3,
  onReviewClick,
  className,
}: CompactReviewListProps) {
  const displayReviews = reviews.slice(0, maxReviews)

  return (
    <div className={cn('space-y-3', className)}>
      {displayReviews.map((review) => (
        <CompactReviewCard
          key={review.id}
          review={review}
          onClick={onReviewClick}
        />
      ))}
      {reviews.length > maxReviews && (
        <Button variant="ghost" size="sm" className="w-full text-xs">
          View all {reviews.length} reviews
        </Button>
      )}
    </div>
  )
}
