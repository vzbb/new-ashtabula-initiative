import { createProject } from '../actions'
import { projectCategories, subcategories } from '@/lib/constants'
import { ProjectWizardClient } from './ProjectWizardClient'

export default function ProjectWizardPage() {
  return (
    <ProjectWizardClient 
      projectCategories={projectCategories}
      subcategories={subcategories}
      createProject={createProject}
    />
  )
}