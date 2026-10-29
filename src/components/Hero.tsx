import { ArrowRight, BadgeCheck, Mail } from "lucide-react"
import { config } from "../data/config"

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pb-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            Available for AI Engineering Opportunities
          </div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-cyan">
            Engr. Muhammad Fahad
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            AI/ML Engineer building{" "}
            <span className="bg-gradient-to-r from-primary via-violet to-cyan bg-clip-text text-transparent">
              intelligent systems
            </span>{" "}
            for real-world problems
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            I&apos;m a Microsoft &amp; Huawei certified AI/ML engineer. I build
            Python AI agents, RAG applications, FastAPI backends, and
            full-stack AI products that solve real business problems.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-violet px-6 py-3 text-sm font-medium text-white shadow-[0_0_80px_-40px_rgba(91,140,255,1)] transition hover:opacity-90"
            >
              Explore AI Projects <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-accent transition hover:bg-card"
            >
              Hire an AI Engineer
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
            <a
              href={config.github}
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-accent"
            >
              GitHub
            </a>
            <a
              href={config.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-accent"
            >
              LinkedIn
            </a>
            <a
              href={"mailto:" + config.email}
              className="inline-flex items-center gap-2 transition hover:text-accent"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Email
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[320px] justify-self-center lg:justify-self-end">
          <div className="absolute -inset-5 -z-10 rounded-[34px] bg-gradient-to-br from-primary/20 via-violet/10 to-cyan/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[26px] border border-border shadow-[0_40px_100px_-70px_rgba(91,140,255,0.9)]">
            <picture>
              <source srcSet="/fahad-portrait.avif" type="image/avif" />
              <source srcSet="/fahad-portrait.webp" type="image/webp" />
              <img
                src="/fahad-portrait.jpg"
                alt="Portrait of Engr. Muhammad Fahad, AI/ML engineer and AI agent developer"
                width={320}
                height={400}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/5] h-auto w-full object-cover object-top"
              />
            </picture>
            <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
              {["AI ENGINEERING", "GENERATIVE AI", "AI AGENTS"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 bg-bg/75 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-accent backdrop-blur"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-xs text-muted">
            <BadgeCheck className="h-4 w-4 text-cyan" aria-hidden="true" />
            Microsoft &amp; Huawei certified
          </div>
        </div>
      </div>
    </section>
  )
}
