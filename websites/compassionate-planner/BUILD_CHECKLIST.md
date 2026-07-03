# BUILD_CHECKLIST.md
## Compassionate Planner - Implementation Guide
### Copy-Paste Ready Build Instructions

**Version:** 1.0  
**Date:** February 2026  
**Status:** Ready for Development

---

## PHASE 1: PROJECT SETUP (Week 1, Day 1)

### 1.1 Initialize Next.js Project

```bash
# Create project directory
mkdir -p /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/compassionate-planner-v2
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/compassionate-planner-v2

# Initialize with shadcn/ui
npx shadcn@latest init --yes --template next --base-color slate

# Answer prompts:
# - Would you like to use TypeScript? › Yes
# - Would you like to use ESLint? › Yes
# - Would you like to use Tailwind CSS? › Yes
# - Would you like to use src/ directory? › Yes
# - Would you like to use App Router? › Yes
# - Would you like to use Turbopack? › No
# - Import alias: @/*
```

### 1.2 Install Dependencies

```bash
# Core dependencies
npm install next-auth@beta @auth/prisma-adapter
npm install prisma @prisma/client
npm install react-hook-form @hookform/resolvers zod
npm install @tanstack/react-query
npm install zustand
npm install date-fns
npm install bcryptjs
npm install @types/bcryptjs --save-dev
npm install uuid @types/uuid --save-dev

# UI components from shadcn
npx shadcn add button
npx shadcn add input
npx shadcn add label
npx shadcn add card
npx shadcn add form
npx shadcn add progress
npx shadcn add tabs
npx shadcn add dialog
npx shadcn add dropdown-menu
npx shadcn add avatar
npx shadcn add badge
npx shadcn add separator
npx shadcn add textarea
npx shadcn add select
npx shadcn add checkbox
npx shadcn add radio-group
npx shadcn add toast
npx shadcn add sonner
npx shadcn add skeleton
npx shadcn add tooltip
npx shadcn add alert
npx shadcn add alert-dialog
npx shadcn add sheet
```

### 1.3 Environment Variables

Create `.env.local`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/compassionate_planner"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-min-32-chars"

# Email (Resend recommended)
RESEND_API_KEY="re_xxxxxxxx"
FROM_EMAIL="noreply@compassionateplanner.ashtabula.oh.us"

# File Storage (Supabase)
SUPABASE_URL="https://xxxx.supabase.co"
SUPABASE_SERVICE_KEY="xxxx"

# App
APP_NAME="Compassionate Planner"
APP_URL="http://localhost:3000"
```

### 1.4 Directory Structure

```bash
mkdir -p src/app/(auth)/login
mkdir -p src/app/(auth)/register
mkdir -p src/app/(auth)/verify-email
mkdir -p src/app/dashboard
mkdir -p src/app/plans/[id]
mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/app/api/plans
mkdir -p src/app/api/documents
mkdir -p src/app/api/shares
mkdir -p src/components/plans
mkdir -p src/components/forms
mkdir -p src/components/ui/custom
mkdir -p src/lib/db
mkdir -p src/lib/auth
mkdir -p src/lib/utils
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/validators
mkdir -p prisma
mkdir -p public/images
```

---

## PHASE 2: DATABASE SETUP (Week 1, Day 2)

### 2.1 Prisma Schema

Create `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  phone         String?
  role          String    @default("user")
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  plans       Plan[]
  tasks       Task[]
  shares      PlanShare[]
  accessLogs  AccessLog[]

  @@map("users")
}

model Plan {
  id          String   @id @default(uuid())
  userId      String
  status      String   @default("in_progress")
  
  // Basic Info
  fullName            String?
  dateOfBirth         DateTime?
  addressLine1        String?
  addressLine2        String?
  city                String?
  state               String?
  zip                 String?
  phone               String?
  email               String?
  emergencyName       String?
  emergencyRelationship String?
  emergencyPhone      String?
  physicianName       String?
  physicianPhone      String?
  
  // Funeral Preferences
  disposition         String?
  serviceType         String?
  serviceLocation     String?
  musicPreferences    String?
  readingPreferences  String?
  specialRequests     String?
  
  completionPercentage Int @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  documents  Document[]
  shares     PlanShare[]
  tasks      Task[]
  accessLogs AccessLog[]

  @@map("plans")
}

model Document {
  id               String   @id @default(uuid())
  planId           String
  type             String
  originalFilename String
  storageKey       String
  fileSize         Int
  mimeType         String
  uploadedAt       DateTime @default(now())

  plan Plan @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@map("documents")
}

model PlanShare {
  id            String    @id @default(uuid())
  planId        String
  sharedWithUserId String?
  sharedWithEmail String
  sharedWithName  String?
  relationship    String?
  accessLevel     String    @default("view")
  inviteToken     String?   @unique
  invitedAt       DateTime  @default(now())
  acceptedAt      DateTime?
  lastAccessedAt  DateTime?
  active          Boolean   @default(true)

  plan Plan @relation(fields: [planId], references: [id], onDelete: Cascade)
  user User? @relation(fields: [sharedWithUserId], references: [id])

  @@map("plan_shares")
}

model Task {
  id          String    @id @default(uuid())
  planId      String
  createdBy   String
  assignedTo  String?
  title       String
  description String?
  category    String?
  priority    String    @default("medium")
  status      String    @default("open")
  dueDate     DateTime?
  completedAt DateTime?
  completedBy String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  plan      Plan @relation(fields: [planId], references: [id], onDelete: Cascade)
  creator   User @relation(fields: [createdBy], references: [id])

  @@map("tasks")
}

model AccessLog {
  id           String   @id @default(uuid())
  userId       String?
  planId       String?
  action       String
  resourceType String?
  resourceId   String?
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())

  user User? @relation(fields: [userId], references: [id])
  plan Plan? @relation(fields: [planId], references: [id])

  @@map("access_logs")
}
```

### 2.2 Database Migration

```bash
# Initialize Prisma
npx prisma init

# Generate migration
npx prisma migrate dev --name init

# Generate client
npx prisma generate

# Create database client singleton
```

Create `src/lib/db/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## PHASE 3: AUTHENTICATION (Week 1, Day 3-4)

### 3.1 NextAuth Configuration

Create `src/lib/auth/config.ts`:
```typescript
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.emailVerified = token.emailVerified as boolean
      }
      return session
    }
  }
}
```

### 3.2 Auth API Route

Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/config"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### 3.3 Registration Page

Create `src/app/(auth)/register/page.tsx`:
```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      toast.success("Registration successful! Please check your email to verify your account.")
      router.push("/login")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Start your end-of-life planning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 3.4 Registration API

Create `src/app/api/auth/register/route.ts`:
```typescript
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(12),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, password } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
      },
    })

    // TODO: Send verification email

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    )
  }
}
```

---

## PHASE 4: DASHBOARD & PLAN MANAGEMENT (Week 2)

### 4.1 Dashboard Layout

Create `src/app/dashboard/page.tsx`:
```typescript
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Plus, FileText, Users, Clock } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const plans = await prisma.plan.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { documents: true, shares: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Compassionate Planner</h1>
            <form action="/api/auth/signout" method="POST">
              <Button type="submit" variant="outline">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold">Welcome, {session.user.firstName}</h2>
            <p className="text-gray-600">Manage your end-of-life plans</p>
          </div>
          <Link href="/plans/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </Link>
        </div>

        {plans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No plans yet</h3>
              <p className="text-gray-600 mb-4">Create your first plan to get started</p>
              <Link href="/plans/new">
                <Button>Create Your First Plan</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Link key={plan.id} href={`/plans/${plan.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{plan.fullName || "Unnamed Plan"}</CardTitle>
                    <CardDescription>
                      Created {new Date(plan.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Completion</span>
                        <span className="font-medium">{plan.completionPercentage}%</span>
                      </div>
                      <Progress value={plan.completionPercentage} />
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {plan._count.documents}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {plan._count.shares}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(plan.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
```

### 4.2 New Plan Creation

Create `src/app/api/plans/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const plan = await prisma.plan.create({
      data: {
        userId: session.user.id,
        status: "in_progress",
        completionPercentage: 0,
      },
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Create plan error:", error)
    return NextResponse.json(
      { message: "Failed to create plan" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const plans = await prisma.plan.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json({ plans })
}
```

---

## PHASE 5: FORM COMPONENTS (Week 3)

### 5.1 Basic Information Form

Create `src/components/forms/BasicInfoForm.tsx`:
```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useCallback } from "react"

const basicInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, "Use 2-letter state code").optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  emergencyName: z.string().optional(),
  emergencyRelationship: z.string().optional(),
  emergencyPhone: z.string().optional(),
  physicianName: z.string().optional(),
  physicianPhone: z.string().optional(),
})

type BasicInfoForm = z.infer<typeof basicInfoSchema>

interface BasicInfoFormProps {
  planId: string
  initialData?: Partial<BasicInfoForm>
}

export function BasicInfoForm({ planId, initialData }: BasicInfoFormProps) {
  const form = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData || {},
  })

  // Auto-save every 30 seconds
  const autoSave = useCallback(async () => {
    const data = form.getValues()
    try {
      await fetch(`/api/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "basicInfo", data }),
      })
    } catch (error) {
      console.error("Auto-save failed:", error)
    }
  }, [form, planId])

  useEffect(() => {
    const interval = setInterval(autoSave, 30000)
    return () => clearInterval(interval)
  }, [autoSave])

  async function onSubmit(data: BasicInfoForm) {
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "basicInfo", data }),
      })

      if (!response.ok) throw new Error("Failed to save")
      
      // Show success toast
    } catch (error) {
      console.error("Save error:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Legal Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Address</h3>
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apt/Suite (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="OH" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Contact Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Emergency Contact</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="emergencyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyRelationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Primary Physician</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="physicianName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physician Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="physicianPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physician Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit">Save Changes</Button>
          <span className="text-sm text-gray-500 self-center">
            Auto-saves every 30 seconds
          </span>
        </div>
      </form>
    </Form>
  )
}
```

---

## PHASE 6: DOCUMENT UPLOAD (Week 3-4)

### 6.1 Document Upload Component

Create `src/components/plans/DocumentUpload.tsx`:
```typescript
"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

interface DocumentUploadProps {
  planId: string
  onUploadComplete?: () => void
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function DocumentUpload({ planId, onUploadComplete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setError(null)

    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "other")

      try {
        const response = await fetch(`/api/plans/${planId}/documents`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
      }
    }

    setUploading(false)
    onUploadComplete?.()
  }, [planId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxSize: MAX_SIZE,
    multiple: true,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Or click to browse. Supports PDF, JPG, PNG up to 10MB.
        </p>
        <Button type="button" variant="outline" disabled={uploading}>
          {uploading ? "Uploading..." : "Select Files"}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}
```

---

## PHASE 7: TESTING CHECKLIST

### 7.1 Unit Testing

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom

# Add test scripts to package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### 7.2 Integration Testing Checklist

| Feature | Test Case | Status |
|---------|-----------|--------|
| Registration | User can register with valid data | ⬜ |
| Registration | User cannot register with existing email | ⬜ |
| Login | User can login with valid credentials | ⬜ |
| Login | User cannot login with invalid password | ⬜ |
| Plan Creation | Authenticated user can create plan | ⬜ |
| Plan Update | User can update basic information | ⬜ |
| Auto-save | Form auto-saves after 30 seconds | ⬜ |
| Document Upload | User can upload PDF documents | ⬜ |
| Document Upload | Large files rejected (>10MB) | ⬜ |
| Family Sharing | User can invite family members | ⬜ |
| Family Sharing | Invited user can accept invitation | ⬜ |
| Access Control | User cannot access other users' plans | ⬜ |

### 7.3 E2E Testing with Playwright

```bash
# Install Playwright
npm init playwright@latest

# Run tests
npx playwright test

# Run with UI
npx playwright test --ui
```

---

## PHASE 8: DEPLOYMENT

### 8.1 Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 8.2 Environment Variables (Production)

```env
# Database (Neon or Railway)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://compassionateplanner.com"
NEXTAUTH_SECRET="[generate with openssl rand -base64 32]"

# Email (Resend)
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@compassionateplanner.com"

# Storage (Supabase)
SUPABASE_URL="https://..."
SUPABASE_SERVICE_KEY="..."
```

### 8.3 Post-Deployment Checklist

- [ ] DNS configured and SSL working
- [ ] Database migrations applied
- [ ] Email sending verified
- [ ] File uploads working
- [ ] Error monitoring (Sentry) configured
- [ ] Analytics (Vercel) enabled
- [ ] Privacy policy page live
- [ ] Terms of service page live
- [ ] 404 page customized
- [ ] Favicon and metadata set

---

## ESTIMATED TIMELINE

| Phase | Duration | Hours |
|-------|----------|-------|
| Phase 1: Setup | 2 days | 8 |
| Phase 2: Database | 1 day | 4 |
| Phase 3: Auth | 2 days | 8 |
| Phase 4: Dashboard | 2 days | 8 |
| Phase 5: Forms | 3 days | 12 |
| Phase 6: Documents | 2 days | 8 |
| Phase 7: Testing | 2 days | 8 |
| Phase 8: Deploy | 1 day | 4 |
| **Total** | **15 days** | **60** |

---

*Document Version: 1.0*  
*Last Updated: 2026-02-19*  
*Status: Ready for Implementation*