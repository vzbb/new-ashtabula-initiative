import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ClipboardList, Star } from 'lucide-react'

export default async function ContractorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get contractor profile
  const { data: contractor } = await supabase
    .from('contractors')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contractor Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your leads and projects</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>New Leads</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">0</CardTitle>
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-1">
              {contractor?.rating_avg || 0}
              <Star className="w-5 h-5 text-yellow-500" />
            </CardTitle>
            <CardDescription>Average Rating</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{contractor?.years_in_business || 0}</CardTitle>
            <CardDescription>Years in Business</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <span>Insurance Verified</span>
                <span className={`px-2 py-1 text-xs rounded-full ${contractor?.insurance_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {contractor?.insurance_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <span>Background Check</span>
                <span className={`px-2 py-1 text-xs rounded-full ${contractor?.background_check_passed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {contractor?.background_check_passed ? 'Passed' : 'Pending'}
                </span>
              </div>
            </div>
            <Link href="/profile">
              <Button className="w-full mt-4" variant="outline">
                Update Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No leads yet. Complete your profile to get matched!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
