'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DollarSign, Clock, Calendar, FileText, Package } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const quoteFormSchema = z.object({
  price: z.union([z.number(), z.undefined()]),
  price_type: z.enum(['fixed', 'hourly', 'estimate']),
  estimated_hours: z.union([z.number(), z.undefined()]),
  hourly_rate: z.union([z.number(), z.undefined()]),
  description: z.string().min(10, 'Please provide a detailed description'),
  materials_included: z.boolean(),
  materials_cost: z.union([z.number(), z.undefined()]),
  timeline_days: z.number().min(1, 'Timeline must be at least 1 day'),
  start_date: z.string().optional(),
  expiry_date: z.string().optional(),
  notes: z.string().optional(),
})

export type QuoteFormData = z.infer<typeof quoteFormSchema>

interface QuoteFormProps {
  projectId: string
  matchId: string
  onSubmit: (data: QuoteFormData) => Promise<void>
  onCancel?: () => void
  defaultValues?: Partial<QuoteFormData>
  className?: string
}

export function QuoteForm({
  projectId,
  matchId,
  onSubmit,
  onCancel,
  defaultValues,
  className,
}: QuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      price_type: 'fixed',
      materials_included: false,
      timeline_days: 7,
      ...defaultValues,
    },
  })

  const priceType = form.watch('price_type')
  const materialsIncluded = form.watch('materials_included')

  const handleSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate total estimate
  const calculateTotal = () => {
    const price = form.watch('price') || 0
    const materials = materialsIncluded ? (form.watch('materials_cost') || 0) : 0
    const hours = form.watch('estimated_hours') || 0
    const rate = form.watch('hourly_rate') || 0
    
    if (priceType === 'hourly') {
      return hours * rate + materials
    }
    return price + materials
  }

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="size-5" />
          Submit Quote
        </CardTitle>
        <CardDescription>
          Provide a detailed quote for this project. Be clear about what&apos;s included.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="size-4" />
                Pricing
              </h3>
              
              <FormField
                control={form.control}
                name="price_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="estimate">Estimate Range</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose how you want to price this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {priceType === 'fixed' && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fixed Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 5000"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {priceType === 'hourly' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hourly_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 75"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estimated_hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Hours</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 40"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {priceType === 'estimate' && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 4000"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide your best estimate. Final price may vary.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Materials */}
              <FormField
                control={form.control}
                name="materials_included"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Package className="size-4" />
                        Materials Included
                      </FormLabel>
                      <FormDescription>
                        Include materials cost in your quote
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

              {materialsIncluded && (
                <FormField
                  control={form.control}
                  name="materials_cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materials Cost ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 800"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Separator />

            {/* Timeline Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="size-4" />
                Timeline
              </h3>

              <FormField
                control={form.control}
                name="timeline_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Timeline (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="e.g., 14"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      How many days will this project take?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        Earliest Start Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        Quote Expiry Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        When does this quote expire?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Description Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="size-4" />
                Details
              </h3>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope of Work</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what work you'll do, what's included, any guarantees..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about what&apos;s included in your quote
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special conditions, payment terms, or other notes..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Quote Summary */}
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold mb-2">Quote Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {priceType === 'hourly' ? 'Labor Estimate' : 'Base Price'}
                  </span>
                  <span>
                    {priceType === 'hourly'
                      ? `$${(form.watch('estimated_hours') || 0) * (form.watch('hourly_rate') || 0)}`
                      : `$${form.watch('price') || 0}`}
                  </span>
                </div>
                {materialsIncluded && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Materials</span>
                    <span>${form.watch('materials_cost') || 0}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total Estimate</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Timeline</span>
                  <span>{form.watch('timeline_days')} days</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote'}
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
