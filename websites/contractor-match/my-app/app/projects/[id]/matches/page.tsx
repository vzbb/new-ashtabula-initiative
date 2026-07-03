import { findMatchingContractors } from '../../../matching/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, MapPin, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MatchesPage({ params }: PageProps) {
  const { id } = await params
  const { matches, project, error } = await findMatchingContractors(id)

  if (error || !project) {
    notFound()
  }

  const matchList = matches || []

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-4">Matching Contractors</h1>
        <p className="text-gray-600 mt-1">
          We found {matchList.length} contractors for your {project.category} project
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
          <CardDescription>{project.subcategory} • {project.urgency} priority</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{project.description}</p>
          {project.budget_min && project.budget_max && (
            <p className="mt-2 text-sm text-gray-600">
              Budget: ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recommended Contractors</h2>
        
        {matchList.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <p>No matching contractors found yet.</p>
              <p className="text-sm mt-2">We're expanding our network. Please check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          matchList.map(({ contractor, matchScore }) => (
            <Card key={contractor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-blue-100 text-blue-800 text-lg">
                        {contractor.company_name?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {contractor.company_name || 'Unnamed Contractor'}
                        </h3>
                        <Badge variant={matchScore >= 100 ? 'default' : 'secondary'}>
                          {matchScore}% Match
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {contractor.rating_avg.toFixed(1)} rating
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {contractor.years_in_business} years in business
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {contractor.specialties.slice(0, 4).map((specialty: string) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-4 mt-3 text-sm">
                        {contractor.insurance_verified && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Shield className="w-4 h-4" />
                            Insurance Verified
                          </span>
                        )}
                        {contractor.background_check_passed && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Shield className="w-4 h-4" />
                            Background Checked
                          </span>
                        )}
                        {contractor.license_number && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <MapPin className="w-4 h-4" />
                            Licensed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button>Request Quote</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}