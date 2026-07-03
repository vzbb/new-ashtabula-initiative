'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Star, Send, ThumbsUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StarRating } from '@/components/ui/star-rating'

const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  professionalism: z.number().min(1).max(5).optional(),
  quality: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  punctuality: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  content: z.string().min(20, 'Review must be at least 20 characters').max(2000),
  would_recommend: z.boolean(),
})

export type ReviewFormData = z.infer<typeof reviewFormSchema>

interface ReviewFormProps {
  projectId: string
  revieweeId: string
  revieweeName: string
  revieweeRole: 'homeowner' | 'contractor'
  reviewerRole: 'homeowner' | 'contractor'
  onSubmit: (data: ReviewFormData) => Promise<void>
  onCancel?: () => void
  className?: string
}

export function ReviewForm({
  projectId,
  revieweeId,
  revieweeName,
  revieweeRole,
  reviewerRole,
  onSubmit,
  onCancel,
  className,
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showDetailed, setShowDetailed] = React.useState(false)

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      would_recommend: true,
      title: '',
      content: '',
    },
  })

  const handleSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const rating = form.watch('rating')
  const wouldRecommend = form.watch('would_recommend')

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="size-5" />
          Write a Review
        </CardTitle>
        <CardDescription>
          Share your experience working with {revieweeName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Overall Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4 py-2">
                      <StarRating
                        rating={field.value}
                        size="lg"
                        interactive
                        onChange={field.onChange}
                      />
                      <span className="text-sm font-medium">
                        {field.value > 0 ? ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][field.value - 1] : 'Select a rating'}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Detailed Ratings Toggle */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailed(!showDetailed)}
                className="text-sm"
              >
                {showDetailed ? 'Hide' : 'Show'} detailed ratings
              </Button>
            </div>

            {/* Detailed Ratings */}
            {showDetailed && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">Rate specific aspects:</p>
                
                <FormField
                  control={form.control}
                  name="professionalism"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="text-sm font-normal">Professionalism</FormLabel>
                      <FormControl>
                        <StarRating
                          rating={field.value || 0}
                          size="sm"
                          interactive
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quality"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="text-sm font-normal">Quality of Work</FormLabel>
                      <FormControl>
                        <StarRating
                          rating={field.value || 0}
                          size="sm"
                          interactive
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="communication"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="text-sm font-normal">Communication</FormLabel>
                      <FormControl>
                        <StarRating
                          rating={field.value || 0}
                          size="sm"
                          interactive
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="punctuality"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="text-sm font-normal">Punctuality</FormLabel>
                      <FormControl>
                        <StarRating
                          rating={field.value || 0}
                          size="sm"
                          interactive
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="text-sm font-normal">Value for Money</FormLabel>
                      <FormControl>
                        <StarRating
                          rating={field.value || 0}
                          size="sm"
                          interactive
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Separator />

            {/* Review Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Summarize your experience in a few words"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief headline for your review
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Review Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your experience working together. What went well? What could be improved?"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be honest and constructive. Your feedback helps others make better decisions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Would Recommend */}
            <FormField
              control={form.control}
              name="would_recommend"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <ThumbsUp className="size-4" />
                      Would Recommend
                    </FormLabel>
                    <FormDescription>
                      Would you recommend working with this {revieweeRole === 'contractor' ? 'contractor' : 'homeowner'}?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Rating Summary */}
            {rating > 0 && (
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">Review Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Overall:</span>
                    <StarRating rating={rating} size="sm" />
                    <span className="font-medium">
                      {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Would recommend:</span>
                    <span className={wouldRecommend ? 'text-green-600' : 'text-red-600'}>
                      {wouldRecommend ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || rating === 0}
              >
                <Send className="size-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
