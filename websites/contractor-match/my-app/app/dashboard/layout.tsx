import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/auth/actions'
import { NotificationBadgeWrapper } from '@/components/ui/notification-badge-wrapper'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  // Fetch unread notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const initialNotifications = notifications || []

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="font-bold text-xl text-blue-600">
                ContractorMatch
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                {role === 'homeowner' ? (
                  <>
                    <Link href="/projects/new" className="text-gray-600 hover:text-gray-900">
                      New Project
                    </Link>
                    <Link href="/projects" className="text-gray-600 hover:text-gray-900">
                      My Projects
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/leads" className="text-gray-600 hover:text-gray-900">
                      Leads
                    </Link>
                    <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                      Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBadgeWrapper
                initialNotifications={initialNotifications}
                userId={user.id}
              />
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
