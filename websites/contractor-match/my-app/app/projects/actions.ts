'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { KanbanStatus } from '@/components/ui/kanban-board'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const projectData = {
    homeowner_id: user.id,
    category: formData.get('category') as string,
    subcategory: formData.get('subcategory') as string,
    description: formData.get('description') as string,
    address: formData.get('address') as string,
    budget_min: parseInt(formData.get('budget_min') as string) || null,
    budget_max: parseInt(formData.get('budget_max') as string) || null,
    urgency: formData.get('urgency') as string,
    status: 'posted',
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    const errorUrl = '/projects/new?error=' + encodeURIComponent(error.message)
    redirect(errorUrl as any)
  }

  revalidatePath('/dashboard')
  redirect(`/projects/${data.id}/matches`)
}

/**
 * Update project status (for Kanban board)
 */
export async function updateProjectStatus(
  projectId: string,
  newStatus: KanbanStatus,
  notes?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Authentication required')
  }

  // Get user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  const role = roleData?.role

  // Verify user has permission to update this project
  const { data: project } = await supabase
    .from('projects')
    .select('homeowner_id, contractor_id')
    .eq('id', projectId)
    .single()

  if (!project) {
    throw new Error('Project not found')
  }

  const isHomeowner = project.homeowner_id === user.id
  const isContractor = project.contractor_id === user.id

  if (!isHomeowner && !isContractor) {
    throw new Error('Not authorized to update this project')
  }

  // Update project status
  const { error: updateError } = await supabase
    .from('projects')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)

  if (updateError) {
    console.error('Error updating project status:', updateError)
    throw new Error('Failed to update project status')
  }

  // Add status history entry
  const { error: historyError } = await supabase
    .from('project_status_history')
    .insert({
      project_id: projectId,
      status: newStatus,
      changed_by: user.id,
      changed_by_role: role || 'homeowner',
      notes: notes || null,
    })

  if (historyError) {
    console.error('Error creating status history:', historyError)
  }

  // Create notification for the other party
  const notifyUserId = isHomeowner ? project.contractor_id : project.homeowner_id
  if (notifyUserId) {
    await supabase.from('notifications').insert({
      user_id: notifyUserId,
      type: 'project_update',
      title: 'Project Status Updated',
      message: `Project status changed to ${newStatus.replace('_', ' ')}`,
      action_url: `/projects/${projectId}`,
      priority: 'normal',
      read: false,
    })
  }

  revalidatePath('/dashboard')
  revalidatePath(`/projects/${projectId}`)

  return { success: true }
}

/**
 * Get user's projects for Kanban board
 */
export async function getUserProjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  const role = roleData?.role

  // Fetch projects based on role
  let query = supabase.from('projects').select('*')

  if (role === 'homeowner') {
    query = query.eq('homeowner_id', user.id)
  } else if (role === 'contractor') {
    // Get projects where contractor has a match
    const { data: matches } = await supabase
      .from('matches')
      .select('project_id')
      .eq('contractor_id', user.id)

    const projectIds = matches?.map((m) => m.project_id) || []
    
    if (projectIds.length === 0) {
      return []
    }

    query = query.in('id', projectIds)
  }

  const { data: projects, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects || []
}