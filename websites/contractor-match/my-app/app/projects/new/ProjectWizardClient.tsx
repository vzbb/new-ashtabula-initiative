'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

const urgencyOptions = [
  { value: 'emergency', label: 'Emergency (< 48 hours)' },
  { value: 'soon', label: 'Soon (1-2 weeks)' },
  { value: 'flexible', label: 'Flexible (2+ weeks)' },
  { value: 'planning', label: 'Planning phase' },
]

interface ProjectCategory {
  value: string
  label: string
  icon: string
}

interface ProjectWizardClientProps {
  projectCategories: ProjectCategory[]
  subcategories: Record<string, string[]>
  createProject: (formData: FormData) => void
}

export function ProjectWizardClient({ 
  projectCategories, 
  subcategories,
  createProject 
}: ProjectWizardClientProps) {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const totalSteps = 3

  const progress = (step / totalSteps) * 100

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <form action={createProject}>
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>What type of project do you need?</CardTitle>
              <CardDescription>Select the category that best describes your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="category" value={selectedCategory} />
              <div className="grid grid-cols-2 gap-3">
                {projectCategories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      selectedCategory === cat.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{cat.icon}</span>
                    <span className="font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!selectedCategory}
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Tell us about your project</CardTitle>
              <CardDescription>Provide details to help contractors understand your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="category" value={selectedCategory} />
              
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select name="subcategory" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {(subcategories[selectedCategory] || []).map((sub: string) => (
                      <SelectItem key={sub} value={sub.toLowerCase().replace(/\s+/g, '_')}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your project in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Project Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, Ashtabula, OH 44004"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)} className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Timeline & Budget</CardTitle>
              <CardDescription>Help us match you with available contractors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="category" value={selectedCategory} />
              
              <div className="space-y-2">
                <Label htmlFor="urgency">How urgent is this project?</Label>
                <Select name="urgency" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_min">Budget Min ($)</Label>
                  <Input
                    id="budget_min"
                    name="budget_min"
                    type="number"
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_max">Budget Max ($)</Label>
                  <Input
                    id="budget_max"
                    name="budget_max"
                    type="number"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Post Project
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}