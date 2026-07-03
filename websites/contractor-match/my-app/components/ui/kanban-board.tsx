'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MoreHorizontal, Clock, Calendar, User } from 'lucide-react'

export type KanbanStatus = 
  | 'posted' 
  | 'quoted' 
  | 'contractor_selected' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'on_hold'

export interface KanbanTask {
  id: string
  title: string
  description?: string
  status: KanbanStatus
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate?: string
  tags?: string[]
  metadata?: Record<string, unknown>
}

export interface KanbanColumn {
  id: KanbanStatus
  title: string
  description?: string
  color?: string
  tasks: KanbanTask[]
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onTaskMove?: (taskId: string, newStatus: KanbanStatus) => void
  onTaskClick?: (task: KanbanTask) => void
  onTaskEdit?: (task: KanbanTask) => void
  onTaskDelete?: (taskId: string) => void
  className?: string
}

const statusColors: Record<KanbanStatus, string> = {
  posted: 'bg-slate-100 border-slate-200',
  quoted: 'bg-blue-50 border-blue-200',
  contractor_selected: 'bg-purple-50 border-purple-200',
  in_progress: 'bg-amber-50 border-amber-200',
  completed: 'bg-green-50 border-green-200',
  cancelled: 'bg-red-50 border-red-200',
  on_hold: 'bg-gray-50 border-gray-200',
}

const statusBadgeColors: Record<KanbanStatus, string> = {
  posted: 'bg-slate-500',
  quoted: 'bg-blue-500',
  contractor_selected: 'bg-purple-500',
  in_progress: 'bg-amber-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  on_hold: 'bg-gray-500',
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

export function KanbanBoard({
  columns,
  onTaskMove,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  className,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = React.useState<KanbanTask | null>(null)
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null)

  const handleDragStart = (task: KanbanTask) => {
    setDraggedTask(task)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDrop = (e: React.DragEvent, columnId: KanbanStatus) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== columnId) {
      onTaskMove?.(draggedTask.id, columnId)
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays < 0) return { text: 'Overdue', color: 'text-red-500' }
    if (diffInDays === 0) return { text: 'Today', color: 'text-amber-500' }
    if (diffInDays === 1) return { text: 'Tomorrow', color: 'text-blue-500' }
    if (diffInDays <= 7) return { text: `${diffInDays} days`, color: 'text-muted-foreground' }
    return { text: date.toLocaleDateString(), color: 'text-muted-foreground' }
  }

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {columns.map((column) => (
        <div
          key={column.id}
          className={cn(
            'flex-shrink-0 w-80 rounded-lg border-2 transition-colors',
            statusColors[column.id],
            dragOverColumn === column.id && 'border-primary ring-2 ring-primary/20'
          )}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDrop={(e) => handleDrop(e, column.id)}
          onDragLeave={() => setDragOverColumn(null)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', statusBadgeColors[column.id])} />
                <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {column.tasks.length}
                </Badge>
              </div>
              {column.tasks.length > 0 && (
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="size-4" />
                </Button>
              )}
            </div>
            {column.description && (
              <p className="text-xs text-muted-foreground">{column.description}</p>
            )}
          </CardHeader>

          <ScrollArea className="h-[calc(100vh-300px)] px-3 pb-3">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {column.tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onTaskClick?.(task)}
                    className={cn(
                      'cursor-grab active:cursor-grabbing',
                      draggedTask?.id === task.id && 'opacity-50'
                    )}
                  >
                    <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Title and Priority */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm leading-tight line-clamp-2">
                              {task.title}
                            </h4>
                            {task.priority && (
                              <Badge
                                variant="secondary"
                                className={cn('text-[10px] px-1.5 py-0 h-auto', priorityColors[task.priority])}
                              >
                                {task.priority}
                              </Badge>
                            )}
                          </div>

                          {/* Description */}
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-auto"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {task.tags.length > 3 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto">
                                  +{task.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Footer: Due date and Assignee */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-3">
                              {task.dueDate && (
                                <div className={cn('flex items-center gap-1 text-xs', formatDate(task.dueDate)?.color)}>
                                  <Clock className="size-3" />
                                  <span>{formatDate(task.dueDate)?.text}</span>
                                </div>
                              )}
                            </div>
                            {task.assignee ? (
                              <div className="flex items-center gap-1.5">
                                {task.assignee.avatar ? (
                                  <img
                                    src={task.assignee.avatar}
                                    alt={task.assignee.name}
                                    className="size-5 rounded-full"
                                  />
                                ) : (
                                  <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="size-3 text-primary" />
                                  </div>
                                )}
                                <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                                  {task.assignee.name}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="size-3" />
                                <span>Unassigned</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {column.tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No tasks</p>
                  <p className="text-xs">Drag tasks here</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  )
}

// Project Status Timeline Component
interface ProjectStatusTimelineProps {
  currentStatus: KanbanStatus
  statusHistory: {
    status: KanbanStatus
    timestamp: string
    changedBy: string
    notes?: string
  }[]
  className?: string
}

const statusOrder: KanbanStatus[] = [
  'posted',
  'quoted',
  'contractor_selected',
  'in_progress',
  'completed',
]

export function ProjectStatusTimeline({
  currentStatus,
  statusHistory,
  className,
}: ProjectStatusTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        {statusOrder.map((status, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex
          const historyItem = statusHistory.find((h) => h.status === status)

          return (
            <React.Fragment key={status}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
                    isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-1.5 capitalize',
                    isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {status.replace('_', ' ')}
                </span>
                {historyItem && (
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(historyItem.timestamp).toLocaleDateString()}
                  </span>
                )}
              </div>
              {index < statusOrder.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    index < currentIndex ? 'bg-green-500' : 'bg-muted'
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// Status Badge Component
interface StatusBadgeProps {
  status: KanbanStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        'capitalize',
        statusBadgeColors[status],
        'text-white',
        className
      )}
    >
      {status.replace('_', ' ')}
    </Badge>
  )
}
