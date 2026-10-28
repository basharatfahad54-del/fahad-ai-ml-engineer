export type Project = {
  title: string
  slug: string
  category: "AI / ML" | "AI Agents" | "Full-Stack" | "Developer Tools"
  description: string
  tech: string[]
  github: string
  demo?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    title: "DevPilot AI: Sandboxed AI Developer Agent",
    slug: "devpilot-ai",
    category: "AI Agents",
    description: "CLI AI agent that turns natural-language requests into plans and executes them through sandboxed tools with permission gates, workspace boundaries, shell allowlists, secret redaction, and SQLite audit logs.",
    tech: ["Python", "LLM Agents", "OpenRouter", "SQLite", "pytest"],
    github: "https://github.com/basharatfahad54-del/Devpilot-Ai",
    featured: true,
  },
  {
    title: "TalentMatch AI: Resume Screening and Candidate Ranking",
    slug: "ai-resume-screening",
    category: "AI / ML",
    description: "Parses resumes and job descriptions, ranks candidates with an auditable weighted scoring model, and surfaces evidence behind each score for explainable candidate matching.",
    tech: ["Python", "FastAPI", "NLP", "scikit-learn", "React", "TypeScript", "PostgreSQL"],
    github: "https://github.com/basharatfahad54-del/AI-Resume-Screening-Candidate-Ranking-System",
    featured: true,
  },
  {
    title: "3D MRI Brain Tumor Segmentation",
    slug: "mri-brain-tumor-segmentation",
    category: "AI / ML",
    description: "Deep learning approach for volumetric 3D MRI brain tumor segmentation using 3D U-Net to detect and isolate tumor regions.",
    tech: ["Python", "Deep Learning", "3D U-Net", "Medical Imaging"],
    github: "https://github.com/basharatfahad54-del/3d-MRI-Brain-tumor-segmentation",
    featured: true,
  },
  {
    title: "HR Manager Web App",
    slug: "hr-manager-webapp",
    category: "Full-Stack",
    description: "Web-based HR management system covering employee records, attendance, leave, payroll, and core HR operations.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/basharatfahad54-del/HR_Manager_webapp",
    featured: false,
  },
  {
    title: "Any Video Downloader",
    slug: "any-video-downloader",
    category: "Developer Tools",
    description: "Lightweight FastAPI app with web UI and REST endpoint for downloading videos; currently supports TikTok.",
    tech: ["Python", "FastAPI", "REST API"],
    github: "https://github.com/basharatfahad54-del/Any-video-downloader",
    featured: false,
  },
]
