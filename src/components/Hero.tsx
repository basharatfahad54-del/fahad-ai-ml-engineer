import { motion } from "framer-motion"
import { ArrowRight, Mail } from "lucide-react"
import { config } from "../data/config"
import photo from "../assets/photo.jpg"

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> Available for AI Engineering Opportunities
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Building <span className="bg-gradient-to-r from-primary via-violet to-cyan bg-clip-text text-transparent">Intelligent Systems</span> for Real-World Problems
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            I&apos;m {config.name}, an AI/ML Engineer focused on intelligent applications, generative AI, autonomous agents, and production-ready software.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-violet px-6 py-3 text-sm font-medium text-white shadow-[0_0_80px_-40px_rgba(91,140,255,1)] transition hover:opacity-90">
              Explore My Work <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-accent transition hover:bg-card">
              Let&apos;s Work Together
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
            <a href={config.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-accent">GitHub</a>
            <a href={config.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-accent">LinkedIn</a>
            <a href={"mailto:" + config.email} className="inline-flex items-center gap-2 transition hover:text-accent"><Mail className="h-4 w-4" /> Email</a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-primary/20 via-violet/10 to-cyan/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-border shadow-[0_60px_140px_-80px_rgba(91,140,255,0.9)]">
            <img src={photo} alt="Portrait of Engr. Muhammad Fahad" className="h-full w-full object-cover object-top" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
              {["AI ENGINEERING", "GENERATIVE AI", "AI AGENTS", "COMPUTER VISION"].map((label) => (
                <span key={label} className="rounded-full border border-white/10 bg-bg/70 px-3 py-1 text-xs uppercase tracking-[0.25em] text-accent backdrop-blur">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
