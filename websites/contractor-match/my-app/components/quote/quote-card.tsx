'use client'

import * as React from 'react'
import { DollarSign, Clock, Calendar, Package, Check, X, Building2, FileText } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StarRating } from '@/components/ui/star-rating'
import type { QuoteFormData } from './quote-form'

export interface QuoteData extends QuoteFormData {
  id: string
  match_id: string
  contractor_id: string
  project_id: string
  contractor?: {
    id: string
    company_name: string
    rating_avg: number
    years_in_business: number
    specialties: string[]
    insurance_verified: boolean
    background_check_passed: boolean
  }
  status: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'expired'
  created_at: string
  updated_at: string
}

interface QuoteCardProps {
  quote: QuoteData
  variant?: 'compact' | 'detailed'
  showActions?: boolean
  onAccept?: (quoteId: string) => void
  onReject?: (quoteId: string) => void
  onViewDetails?: (quote: QuoteData) => void
  isSelected?: boolean
  className?: string
}

export function QuoteCard({
  quote,
  variant = 'compact',
  showActions = false,
  onAccept,
  onReject,
  onViewDetails,
  isSelected = false,
  className,
}: QuoteCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString()
  }

  const calculateTotal = () => {
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

  const getPriceDisplay = () => {
    if (quote.price_type === 'hourly') {
      return `$${quote.hourly_rate}/hr × ${quote.estimated_hours} hrs`
    }
    return `$${quote.price?.toLocaleString()}`
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    submitted: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-orange-100 text-orange-700',
  }

  if (variant === 'compact') {
    return (
      <Card 
        className={cn(
          'transition-all cursor-pointer hover:shadow-md',
          isSelected && 'ring-2 ring-primary shadow-md',
          className
        )}
        onClick={() => onViewDetails?.(quote)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {quote.contractor?.company_name || 'Unknown Contractor'}
                </CardTitle>
                {quote.contractor && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <StarRating rating={quote.contractor.rating_avg} size="xs" />
                    <span>({quote.contractor.rating_avg.toFixed(1)})</span>
                    <span>•</span>
                    <span>{quote.contractor.years_in_business} years exp.</span>
                  </div>
                )}
              </div>
            </div>
            <Badge className={statusColors[quote.status]}>
              {quote.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold">${calculateTotal().toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{getPriceDisplay()}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>{quote.timeline_days} days</span>
              </div>
              {quote.start_date && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <span>Starts {formatDate(quote.start_date)}</span>
                </div>
              )}
            </div>
          </div>
          
          {quote.materials_included && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <Package className="size-4" />
              <span>Materials included (${quote.materials_cost?.toLocaleString()})</span>
            </div>
          )}

          {quote.contractor?.specialties && (
            <div className="flex flex-wrap gap-1 mt-3">
              {quote.contractor.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        {showActions && quote.status === 'submitted' && (
          <CardFooter className="pt-0 gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                onAccept?.(quote.id)
              }}
            >
              <Check className="size-4 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                onReject?.(quote.id)
              }}
            >
              <X className="size-4 mr-1" />
              Decline
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }

  // Detailed variant
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle>{quote.contractor?.company_name || 'Unknown Contractor'}</CardTitle>
              {quote.contractor && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <StarRating rating={quote.contractor.rating_avg} size="sm" showValue />
                  <span>•</span>
                  <span>{quote.contractor.years_in_business} years in business</span>
                </div>
              )}
            </div>
          </div>
          <Badge className={statusColors[quote.status]} variant="secondary">
            {quote.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing Breakdown */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="size-4" />
            Pricing
          </h4>
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {quote.price_type === 'hourly' ? 'Labor (hourly)' : 'Base Price'}
              </span>
              <span>{getPriceDisplay()}</span>
            </div>
            {quote.materials_included && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Materials</span>
                <span>${quote.materials_cost?.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">${calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="size-4" />
            Timeline
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Duration</span>
              <p className="font-medium">{quote.timeline_days} days</p>
            </div>
            <div>
              <span className="text-muted-foreground">Earliest Start</span>
              <p className="font-medium">{formatDate(quote.start_date)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Quote Expires</span>
              <p className="font-medium">{formatDate(quote.expiry_date)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Submitted</span>
              <p className="font-medium">{formatDate(quote.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {quote.description && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="size-4" />
              Scope of Work
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {quote.description}
            </p>
          </div>
        )}

        {/* Additional Notes */}
        {quote.notes && (
          <div>
            <h4 className="font-semibold mb-2">Additional Notes</h4>
            <p className="text-sm text-muted-foreground">{quote.notes}</p>
          </div>
        )}

        {/* Contractor Verification */}
        {quote.contractor && (
          <div>
            <h4 className="font-semibold mb-3">Contractor Verification</h4>
            <div className="flex gap-2">
              {quote.contractor.insurance_verified && (
                <Badge variant="outline" className="text-green-600">
                  <Check className="size-3 mr-1" />
                  Insurance Verified
                </Badge>
              )}
              {quote.contractor.background_check_passed && (
                <Badge variant="outline" className="text-green-600">
                  <Check className="size-3 mr-1" />
                  Background Checked
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      {showActions && quote.status === 'submitted' && (
        <CardFooter className="gap-3">
          <Button
            className="flex-1"
            onClick={() => onAccept?.(quote.id)}
          >
            <Check className="size-4 mr-2" />
            Accept Quote
          </Button>
          <Button
            variant="outline"
            onClick={() => onReject?.(quote.id)}
          >
            <X className="size-4 mr-2" />
            Decline
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
