'use server'

import { createClient } from '@/lib/supabase/server'

export async function findMatchingContractors(projectId: string) {
  const supabase = await createClient()

  // Get project details
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (!project) {
    return { error: 'Project not found' }
  }

  // Simple rule-based matching: specialty match
  const { data: contractors, error } = await supabase
    .from('contractors')
    .select('*')
    .contains('specialties', [project.category])
    .order('rating_avg', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  // Calculate match scores
  const matches = contractors?.map((contractor) => {
    let score = 0
    
    // Specialty match (100 points if matches)
    if (contractor.specialties.includes(project.category)) {
      score += 100
    }
    
    // Rating bonus (up to 20 points)
    score += (contractor.rating_avg / 5) * 20
    
    // Years in business bonus (up to 10 points, max 10 years)
    score += Math.min(contractor.years_in_business, 10)
    
    // Verification bonus (10 points each)
    if (contractor.insurance_verified) score += 10
    if (contractor.background_check_passed) score += 10

    return {
      contractor,
      matchScore: Math.min(Math.round(score), 150),
    }
  }).sort((a, b) => b.matchScore - a.matchScore) || []

  // Save matches to database
  for (const match of matches) {
    await supabase.from('matches').upsert({
      project_id: projectId,
      contractor_id: match.contractor.id,
      match_score: match.matchScore,
      status: 'pending',
    }, {
      onConflict: 'project_id,contractor_id'
    })
  }

  return { matches, project }
}