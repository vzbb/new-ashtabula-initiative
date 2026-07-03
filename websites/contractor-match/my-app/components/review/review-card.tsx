'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ThumbsUp, Flag, CheckCircle, MessageSquare, Star } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating, RatingBreakdown } from '@/components/ui/star-rating'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export interface Review {
  id: string
  reviewer_id: string
  reviewer_name: string
  reviewer_role: 'homeowner' | 'contractor'
  reviewee_id: string
  project_id?: string | null
  rating: number
  professionalism?: number | null
  quality?: number | null
  communication?: number | null
  punctuality?: number | null
  value?: number | null
  title: string
  content: string
  would_recommend: boolean | null
  verified_hire: boolean
  helpful_count: number
  status: 'pending' | 'published' | 'flagged' | 'removed'
  created_at: string
  updated_at: string
}

interface ReviewCardProps {
  review: Review
  onHelpful?: (reviewId: string) => void
  onFlag?: (reviewId: string) => void
  onReply?: (reviewId: string) => void
  showActions?: boolean
  className?: string
}

export function ReviewCard({
  review,
  onHelpful,
  onFlag,
  onReply,
  showActions = true,
  className,
}: ReviewCardProps) {
  const [isHelpfulClicked, setIsHelpfulClicked] = React.useState(false)

  const handleHelpful = () => {
    if (!isHelpfulClicked && onHelpful) {
      setIsHelpfulClicked(true)
      onHelpful(review.id)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 30) return `${diffInDays} days ago`
    if (diffInDays < 365) return format(date, 'MMM d')
    return format(date, 'MMM d, yyyy')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const hasDetailedRatings =
    review.professionalism !== null ||
    review.quality !== null ||
    review.communication !== null ||
    review.punctuality !== null ||
    review.value !== null

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Reviewer Info */}
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(review.reviewer_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{review.reviewer_name}</span>
                {review.verified_hire && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-auto">
                    <CheckCircle className="size-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{review.reviewer_role}</span>
                <span>•</span>
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" showValue />
            </div>
            {review.would_recommend !== null && (
              <span
                className={cn(
                  'text-xs mt-1',
                  review.would_recommend ? 'text-green-600' : 'text-red-600'
                )}
              >
                {review.would_recommend ? 'Recommends' : 'Does not recommend'}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review Title */}
        <div>
          <h4 className="font-semibold text-base">{review.title}</h4>
        </div>

        {/* Review Content */}
        <p className="text-sm text-foreground leading-relaxed">{review.content}</p>

        {/* Detailed Ratings */}
        {hasDetailedRatings && (
          <div className="bg-muted/50 rounded-lg p-3">
            <RatingBreakdown
              professionalism={review.professionalism ?? undefined}
              quality={review.quality ?? undefined}
              communication={review.communication ?? undefined}
              punctuality={review.punctuality ?? undefined}
              value={review.value ?? undefined}
              size="xs"
            />
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelpful}
                disabled={isHelpfulClicked}
                className={cn(
                  'text-xs h-8',
                  isHelpfulClicked && 'text-green-600 bg-green-50'
                )}
              >
                <ThumbsUp className="size-3.5 mr-1.5" />
                Helpful ({review.helpful_count + (isHelpfulClicked ? 1 : 0)})
              </Button>

              {onReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(review.id)}
                  className="text-xs h-8"
                >
                  <MessageSquare className="size-3.5 mr-1.5" />
                  Reply
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onFlag && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFlag(review.id)}
                  className="text-xs h-8 text-muted-foreground hover:text-red-600"
                >
                  <Flag className="size-3.5 mr-1.5" />
                  Report
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact Review Card for Lists
interface CompactReviewCardProps {
  review: Review
  onClick?: (review: Review) => void
  className?: string
}

export function CompactReviewCard({ review, onClick, className }: CompactReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'MMM d, yyyy')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card
      className={cn(
        'w-full cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={() => onClick?.(review)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(review.reviewer_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-sm truncate">{review.reviewer_name}</span>
              <StarRating rating={review.rating} size="xs" />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {review.content}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              <span>{formatDate(review.created_at)}</span>
              {review.verified_hire && (
                <>
                  <span>•</span>
                  <span className="text-green-600 flex items-center gap-0.5">
                    <CheckCircle className="size-3" />
                    Verified
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
