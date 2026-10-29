import projectData from "./projects.json"

export type ProjectPage = {
  seoTitle: string
  metaDescription: string
  summary: string
  problem: string
  approach: string[]
  architecture: string[]
  evidence: string[]
  limitations: string[]
  keywords: string[]
}

export type Project = {
  title: string
  slug: string
  category: "AI / ML" | "AI Agents" | "Full-Stack" | "Developer Tools"
  description: string
  tech: string[]
  github: string
  demo?: string
  featured: boolean
  page?: ProjectPage
}

export const projects = projectData as Project[]

export const caseStudyProjects = projects.filter((project) => project.page)

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
