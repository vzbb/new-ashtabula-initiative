'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ReviewFormData } from '@/components/review/review-form'

export interface ReviewActionResult {
  success: boolean
  error?: string
  reviewId?: string
}

/**
 * Submit a new review
 */
export async function submitReview(
  projectId: string,
  revieweeId: string,
  reviewerRole: 'homeowner' | 'contractor',
  revieweeRole: 'homeowner' | 'contractor',
  formData: ReviewFormData
): Promise<ReviewActionResult> {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }

  // Verify the reviewer has permission to review (they must be involved in the project)
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('id, status')
    .eq('project_id', projectId)
    .eq('contractor_id', user.id)
    .single()

  // If not a contractor match, check if they're the homeowner
  let isHomeowner = false
  if (matchError || !match) {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('homeowner_id')
      .eq('id', projectId)
      .single()

    if (!projectError && project && project.homeowner_id === user.id) {
      isHomeowner = true
    }
  }

  if (!match && !isHomeowner) {
    return { success: false, error: 'Not authorized to review this project' }
  }

  // Check if review already exists
  const { data: existingReview, error: existingError } = await supabase
    .from('reviews')
    .select('id')
    .eq('reviewer_id', user.id)
    .eq('reviewee_id', revieweeId)
    .eq('project_id', projectId)
    .single()

  if (existingReview) {
    return { success: false, error: 'You have already reviewed this project' }
  }

  // Insert the review
  const { data: review, error: insertError } = await supabase
    .from('reviews')
    .insert({
      reviewer_id: user.id,
      reviewer_role: reviewerRole,
      reviewee_id: revieweeId,
      reviewee_role: revieweeRole,
      project_id: projectId,
      match_id: match?.id || null,
      rating: formData.rating,
      professionalism: formData.professionalism || null,
      quality: formData.quality || null,
      communication: formData.communication || null,
      punctuality: formData.punctuality || null,
      value: formData.value || null,
      title: formData.title,
      content: formData.content,
      would_recommend: formData.would_recommend,
      verified_hire: true, // Verified since they worked together
      status: 'published',
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('Error submitting review:', insertError)
    return { success: false, error: 'Failed to submit review' }
  }

  // Update contractor rating average if reviewing a contractor
  if (revieweeRole === 'contractor') {
    await updateContractorRating(revieweeId)
  }

  // Create notification for the reviewee
  await createReviewNotification(revieweeId, user.id, projectId, formData.rating)

  revalidatePath(`/projects/${projectId}`)
  revalidatePath(`/profile/${revieweeId}`)

  return { success: true, reviewId: review.id }
}

/**
 * Get reviews for a specific user
 */
export async function getReviewsForUser(userId: string) {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:reviewer_id(full_name)
    `)
    .eq('reviewee_id', userId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return reviews.map((review) => ({
    ...review,
    reviewer_name: review.reviewer?.full_name || 'Anonymous',
  }))
}

/**
 * Get reviews written by a specific user
 */
export async function getReviewsByUser(userId: string) {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewee:reviewee_id(full_name)
    `)
    .eq('reviewer_id', userId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return reviews.map((review) => ({
    ...review,
    reviewee_name: review.reviewee?.full_name || 'Anonymous',
  }))
}

/**
 * Mark a review as helpful
 */
export async function markReviewHelpful(reviewId: string): Promise<ReviewActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }

  const { error } = await supabase
    .from('reviews')
    .update({
      helpful_count: supabase.rpc('increment', { x: 1 }),
    })
    .eq('id', reviewId)

  if (error) {
    // Fallback: use raw SQL increment
    const { error: updateError } = await supabase.rpc('increment_review_helpful', {
      review_id: reviewId,
    })

    if (updateError) {
      console.error('Error marking review helpful:', updateError)
      return { success: false, error: 'Failed to mark review as helpful' }
    }
  }

  return { success: true }
}

/**
 * Flag a review for moderation
 */
export async function flagReview(
  reviewId: string,
  reason: string
): Promise<ReviewActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Authentication required' }
  }

  const { error } = await supabase
    .from('reviews')
    .update({
      status: 'flagged',
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)

  if (error) {
    console.error('Error flagging review:', error)
    return { success: false, error: 'Failed to flag review' }
  }

  // Create a moderation log entry (if we had a moderation table)
  // For now, just log it
  console.log(`Review ${reviewId} flagged by user ${user.id}: ${reason}`)

  return { success: true }
}

/**
 * Update contractor's average rating
 */
async function updateContractorRating(contractorId: string) {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', contractorId)
    .eq('status', 'published')

  if (error || !reviews || reviews.length === 0) {
    return
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  await supabase
    .from('contractors')
    .update({ rating_avg: average })
    .eq('id', contractorId)
}

/**
 * Create a notification for the reviewee
 */
async function createReviewNotification(
  revieweeId: string,
  reviewerId: string,
  projectId: string,
  rating: number
) {
  const supabase = await createClient()

  // Get reviewer name
  const { data: reviewer } = await supabase
    .from('homeowners')
    .select('full_name')
    .eq('id', reviewerId)
    .single()

  const reviewerName = reviewer?.full_name || 'Someone'

  await supabase.from('notifications').insert({
    user_id: revieweeId,
    type: 'review_received',
    title: 'New Review Received',
    message: `${reviewerName} left you a ${rating}-star review`,
    action_url: `/projects/${projectId}`,
    priority: 'normal',
    read: false,
  })
}
