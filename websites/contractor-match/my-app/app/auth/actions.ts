'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    const errorUrl = '/login?error=' + encodeURIComponent(error.message)
    redirect(errorUrl as any)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'homeowner' | 'contractor'
  const fullName = formData.get('full_name') as string
  const companyName = formData.get('company_name') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: fullName,
        company_name: companyName,
      },
    },
  })

  if (error) {
    const errorUrl = '/register?error=' + encodeURIComponent(error.message)
    redirect(errorUrl as any)
  }

  // Create user role entry
  if (data.user) {
    await supabase.from('user_roles').insert({
      user_id: data.user.id,
      role,
    })

    // Create profile entry based on role
    if (role === 'homeowner') {
      await supabase.from('homeowners').insert({
        id: data.user.id,
        email,
        full_name: fullName,
      })
    } else {
      await supabase.from('contractors').insert({
        id: data.user.id,
        email,
        company_name: companyName,
      })
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}