import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, DollarSign, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('homeowner_id', user.id)
    .single()

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold capitalize">{project.category}</h1>
        <p className="text-gray-600 mt-1">Project details and status</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={project.status === 'posted' ? 'default' : 'secondary'} className="capitalize">
              {project.status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Urgency</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="capitalize text-gray-700">{project.urgency}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Posted</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-gray-700">
              {new Date(project.created_at).toLocaleDateString()}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.subcategory && (
            <div>
              <span className="text-sm text-gray-500">Subcategory</span>
              <p className="font-medium capitalize">{project.subcategory.replace(/_/g, ' ')}</p>
            </div>
          )}
          
          {project.description && (
            <div>
              <span className="text-sm text-gray-500">Description</span>
              <p className="mt-1">{project.description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-6 pt-4">
            {project.budget_min && project.budget_max && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500 block">Budget Range</span>
                  <span className="font-medium">
                    ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-sm text-gray-500 block">Urgency</span>
                <span className="font-medium capitalize">{project.urgency}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-sm text-gray-500 block">Posted Date</span>
                <span className="font-medium">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Link href={`/projects/${project.id}/matches`}>
          <Button>View Matching Contractors</Button>
        </Link>
      </div>
    </div>
  )
}
