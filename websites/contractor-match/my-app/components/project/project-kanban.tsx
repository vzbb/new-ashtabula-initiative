'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { KanbanBoard, KanbanColumn, KanbanTask, type KanbanStatus } from '@/components/ui/kanban-board'
import { ProjectStatusTimeline } from '@/components/ui/kanban-board'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export interface Project {
  id: string
  title: string
  description?: string
  status: KanbanStatus
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  homeowner_id: string
  contractor_id?: string | null
  created_at: string
  updated_at: string
  category?: string
  budget_min?: number | null
  budget_max?: number | null
}

export interface StatusHistoryItem {
  status: KanbanStatus
  timestamp: string
  changedBy: string
  notes?: string
}

interface ProjectKanbanProps {
  projects: Project[]
  userRole: 'homeowner' | 'contractor'
  userId: string
  onStatusChange?: (projectId: string, newStatus: KanbanStatus) => Promise<void>
  showTimeline?: boolean
  className?: string
}

// Convert project status to kanban status
const mapProjectStatus = (status: string): KanbanStatus => {
  const statusMap: Record<string, KanbanStatus> = {
    'posted': 'posted',
    'quoted': 'quoted',
    'contractor_selected': 'contractor_selected',
    'in_progress': 'in_progress',
    'completed': 'completed',
    'cancelled': 'cancelled',
    'on_hold': 'on_hold',
  }
  return statusMap[status] || 'posted'
}

// Convert projects to kanban tasks
const projectsToTasks = (projects: Project[]): KanbanTask[] => {
  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    status: mapProjectStatus(project.status),
    priority: project.priority || 'normal',
    assignee: project.contractor_id ? {
      id: project.contractor_id,
      name: 'Contractor', // Would be fetched from profile
    } : undefined,
    dueDate: undefined, // Would be calculated from timeline
    tags: project.category ? [project.category] : undefined,
    metadata: {
      budget_min: project.budget_min,
      budget_max: project.budget_max,
      homeowner_id: project.homeowner_id,
    },
  }))
}

// Create kanban columns from tasks
const createColumns = (tasks: KanbanTask[]): KanbanColumn[] => {
  const statuses: KanbanStatus[] = ['posted', 'quoted', 'contractor_selected', 'in_progress', 'completed', 'on_hold']
  
  const columnConfig: Record<KanbanStatus, { title: string; description: string; color: string }> = {
    posted: { 
      title: 'Posted', 
      description: 'New projects waiting for quotes',
      color: 'bg-slate-100 border-slate-200'
    },
    quoted: { 
      title: 'Quoted', 
      description: 'Projects with quotes received',
      color: 'bg-blue-50 border-blue-200'
    },
    contractor_selected: { 
      title: 'Contractor Selected', 
      description: 'Contractor chosen, pending start',
      color: 'bg-purple-50 border-purple-200'
    },
    in_progress: { 
      title: 'In Progress', 
      description: 'Active projects being worked on',
      color: 'bg-amber-50 border-amber-200'
    },
    completed: { 
      title: 'Completed', 
      description: 'Finished projects',
      color: 'bg-green-50 border-green-200'
    },
    cancelled: { 
      title: 'Cancelled', 
      description: 'Cancelled or abandoned projects',
      color: 'bg-red-50 border-red-200'
    },
    on_hold: { 
      title: 'On Hold', 
      description: 'Temporarily paused projects',
      color: 'bg-gray-50 border-gray-200'
    },
  }

  return statuses.map((status) => ({
    id: status,
    title: columnConfig[status].title,
    description: columnConfig[status].description,
    color: columnConfig[status].color,
    tasks: tasks.filter((task) => task.status === status),
  }))
}

export function ProjectKanban({
  projects,
  userRole,
  userId,
  onStatusChange,
  showTimeline = false,
  className,
}: ProjectKanbanProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null)

  const tasks = React.useMemo(() => projectsToTasks(projects), [projects])
  const columns = React.useMemo(() => createColumns(tasks), [tasks])

  // Get active project for timeline view
  const activeProject = projects.find((p) => 
    ['quoted', 'contractor_selected', 'in_progress'].includes(p.status)
  )

  const handleTaskMove = async (taskId: string, newStatus: KanbanStatus) => {
    if (!onStatusChange) return
    
    setIsUpdating(taskId)
    try {
      await onStatusChange(taskId, newStatus)
      toast.success(`Project moved to ${newStatus.replace('_', ' ')}`)
    } catch (error) {
      toast.error('Failed to update project status')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleTaskClick = (task: KanbanTask) => {
    router.push(`/projects/${task.id}`)
  }

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = projects.length
    const active = projects.filter((p) => 
      ['posted', 'quoted', 'contractor_selected', 'in_progress'].includes(p.status)
    ).length
    const completed = projects.filter((p) => p.status === 'completed').length
    const inProgress = projects.filter((p) => p.status === 'in_progress').length

    return { total, active, completed, inProgress }
  }, [projects])

  return (
    <div className={className}>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.inProgress}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline View for Active Project */}
      {showTimeline && activeProject && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Project Status</CardTitle>
            <CardDescription>{activeProject.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectStatusTimeline
              currentStatus={mapProjectStatus(activeProject.status)}
              statusHistory={[
                { status: 'posted', timestamp: activeProject.created_at, changedBy: 'System' },
                ...(activeProject.status !== 'posted' ? [{ 
                  status: mapProjectStatus(activeProject.status), 
                  timestamp: activeProject.updated_at, 
                  changedBy: userRole === 'homeowner' ? 'You' : 'Homeowner' 
                }] : []),
              ]}
            />
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <KanbanBoard
        columns={columns}
        onTaskMove={handleTaskMove}
        onTaskClick={handleTaskClick}
        className="h-[calc(100vh-350px)]"
      />
    </div>
  )
}

// Simple Project List View (alternative to Kanban)
interface ProjectListViewProps {
  projects: Project[]
  userRole: 'homeowner' | 'contractor'
  onProjectClick?: (project: Project) => void
  className?: string
}

export function ProjectListView({
  projects,
  userRole,
  onProjectClick,
  className,
}: ProjectListViewProps) {
  const router = useRouter()

  const handleClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project)
    } else {
      router.push(`/projects/${project.id}`)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      'posted': 'bg-slate-500',
      'quoted': 'bg-blue-500',
      'contractor_selected': 'bg-purple-500',
      'in_progress': 'bg-amber-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500',
      'on_hold': 'bg-gray-500',
    }
    return colors[status] || 'bg-slate-500'
  }

  return (
    <div className={className}>
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="cursor-pointer hover:shadow-md transition-shadow mb-3"
          onClick={() => handleClick(project)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{project.title}</h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusBadgeColor(project.status)}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                  {project.category && (
                    <Badge variant="outline">{project.category}</Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                {project.budget_min && project.budget_max && (
                  <p className="text-sm font-medium">
                    ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
