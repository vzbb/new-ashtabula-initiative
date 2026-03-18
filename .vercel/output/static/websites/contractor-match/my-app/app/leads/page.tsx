import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default async function LeadsPage() {
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

  if (roleData?.role !== 'contractor') {
    redirect('/dashboard')
  }

  // Get contractor specialties
  const { data: contractor } = await supabase
    .from('contractors')
    .select('specialties')
    .eq('id', user.id)
    .single()

  // Find matching projects based on specialties
  const { data: leads } = await supabase
    .from('projects')
    .select(`
      *,
      matches!inner(*)
    `)
    .eq('matches.contractor_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Leads</h1>
        <p className="text-gray-600 mt-1">Projects matching your specialties</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Specialties</CardTitle>
          <CardDescription>Update your profile to receive more relevant leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {contractor?.specialties?.map((specialty: string) => (
              <Badge key={specialty} variant="secondary" className="capitalize">
                {specialty}
              </Badge>
            )) || (
              <p className="text-gray-500">No specialties set.{' '}
                <Link href="/profile" className="text-blue-600 hover:underline">Update Profile</Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Matching Projects</h2>
        
        {leads && leads.length > 0 ? (
          leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-lg capitalize">{lead.category}</h3>
                      <Badge variant="default">
                        {lead.matches?.[0]?.match_score || 0}% Match
                      </Badge>
                    </div>
                    
                    {lead.subcategory && (
                      <p className="text-gray-600 capitalize">{lead.subcategory.replace(/_/g, ' ')}</p>
                    )}
                    
                    <p className="text-gray-700 max-w-xl">{lead.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {lead.urgency}
                      </span>
                      {lead.budget_min && lead.budget_max && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${lead.budget_min.toLocaleString()} - ${lead.budget_max.toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <Button>Submit Quote</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No matching projects yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                New projects will appear here when they match your specialties.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}