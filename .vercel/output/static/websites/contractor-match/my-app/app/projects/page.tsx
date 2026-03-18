import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'homeowner') {
    redirect('/dashboard')
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('homeowner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-gray-600 mt-1">Track and manage your home improvement projects</p>
        </div>
        <Link href="/projects/new">
          <Button>Start New Project</Button>
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg capitalize">{project.category}</h3>
                      <Badge variant={project.status === 'posted' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    {project.subcategory && (
                      <p className="text-gray-600 capitalize">{project.subcategory.replace(/_/g, ' ')}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.urgency}
                      </span>
                      {project.budget_min && project.budget_max && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <Link href={`/projects/${project.id}/matches` as any}>
                    <Button variant="outline">View Matches</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">You haven't posted any projects yet.</p>
            <Link href="/projects/new">
              <Button className="mt-4">Start Your First Project</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}