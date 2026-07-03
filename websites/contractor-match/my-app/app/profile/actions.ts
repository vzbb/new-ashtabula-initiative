'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateContractorProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profileData = {
    company_name: formData.get('company_name') as string,
    phone: formData.get('phone') as string,
    license_number: formData.get('license_number') as string,
    years_in_business: parseInt(formData.get('years_in_business') as string) || 0,
    service_radius_miles: parseInt(formData.get('service_radius_miles') as string) || 25,
    specialties: (formData.get('specialties') as string).split(',').map(s => s.trim()).filter(Boolean),
  }

  const { error } = await supabase
    .from('contractors')
    .update(profileData)
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    const errorUrl = '/profile?error=' + encodeURIComponent(error.message)
    redirect(errorUrl as any)
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile')
  redirect('/profile?success=true')
}