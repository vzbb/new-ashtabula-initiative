import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateContractorProfile } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Shield, AlertCircle } from 'lucide-react'

const allSpecialties = [
  'roofing', 'plumbing', 'electrical', 'hvac', 'landscaping',
  'remodeling', 'painting', 'flooring', 'decks_fences', 'handyman'
]

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string }
}) {
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

  const { data: contractor } = await supabase
    .from('contractors')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!contractor) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contractor Profile</h1>
        <p className="text-gray-600 mt-1">Manage your business information and verification status</p>
      </div>

      {searchParams.success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Profile updated successfully!
        </div>
      )}

      {searchParams.error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {searchParams.error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your company details and service areas</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateContractorProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    defaultValue={contractor.company_name || ''}
                    placeholder="ABC Construction"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={contractor.phone || ''}
                    placeholder="(440) 555-0123"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    name="license_number"
                    defaultValue={contractor.license_number || ''}
                    placeholder="OH123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years_in_business">Years in Business</Label>
                  <Input
                    id="years_in_business"
                    name="years_in_business"
                    type="number"
                    min="0"
                    defaultValue={contractor.years_in_business || 0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_radius_miles">Service Radius (miles)</Label>
                <Input
                  id="service_radius_miles"
                  name="service_radius_miles"
                  type="number"
                  min="5"
                  max="200"
                  defaultValue={contractor.service_radius_miles || 25}
                />
                <p className="text-sm text-gray-500">How far you're willing to travel for projects</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                <Input
                  id="specialties"
                  name="specialties"
                  defaultValue={contractor.specialties?.join(', ') || ''}
                  placeholder="roofing, plumbing, electrical"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {allSpecialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant={contractor.specialties?.includes(specialty) ? 'default' : 'outline'}
                      className="cursor-pointer text-xs"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {contractor.insurance_verified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span>Insurance Verified</span>
                </div>
                <Badge variant={contractor.insurance_verified ? 'default' : 'secondary'}>
                  {contractor.insurance_verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {contractor.background_check_passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span>Background Check</span>
                </div>
                <Badge variant={contractor.background_check_passed ? 'default' : 'secondary'}>
                  {contractor.background_check_passed ? 'Passed' : 'Pending'}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {contractor.license_number ? (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span>License on File</span>
                </div>
                <Badge variant={contractor.license_number ? 'default' : 'secondary'}>
                  {contractor.license_number ? 'Yes' : 'No'}
                </Badge>
              </div>

              <div className="text-sm text-gray-500 mt-4">
                <p>Verification badges help homeowners trust your business.</p>
                <p className="mt-2">Contact support to complete verification.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Rating</span>
                <span className="font-medium">{contractor.rating_avg.toFixed(1)} / 5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specialties</span>
                <span className="font-medium">{contractor.specialties?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Radius</span>
                <span className="font-medium">{contractor.service_radius_miles} miles</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}