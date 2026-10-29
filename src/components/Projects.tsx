import { useMemo, useState } from "react"
import { ArrowRight, ExternalLink } from "lucide-react"
import { projects } from "../data/projects"

const categories = ["ALL", "AI / ML", "AI AGENTS", "Full-Stack", "Developer Tools"] as const

export default function Projects() {
  const [active, setActive] = useState<(typeof categories)[number]>("ALL")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = active === "ALL" || project.category === active
      const haystack = (
        project.title +
        " " +
        project.description +
        " " +
        project.tech.join(" ")
      ).toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [active, query])

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="reveal">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan">
            Featured Projects
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            AI, ML, and Full-Stack Projects
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Selected public repositories showing practical AI engineering, agent
            safety, explainable machine learning, and production-focused
            software delivery.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="project-search" className="sr-only">
            Search projects or technologies
          </label>
          <input
            id="project-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects or technologies"
            className="w-full rounded-lg border border-border bg-card/60 px-4 py-2 text-sm text-accent placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary sm:w-72"
          />
          <div className="flex flex-wrap gap-2" aria-label="Filter projects by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                aria-pressed={active === cat}
                className={
                  "rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] transition " +
                  (active === cat
                    ? "bg-gradient-to-r from-primary to-violet text-white"
                    : "border border-border text-muted hover:text-accent")
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((project) => (
          <article
            key={project.slug}
            className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-bg2"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-violet/15" />
            <div className="relative flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.25em] text-muted">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="text-xs uppercase tracking-[0.25em] text-cyan">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">
                {project.page ? (
                  <a
                    href={`/projects/${project.slug}/`}
                    className="transition hover:text-cyan"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              <p className="mt-3 flex-1 text-muted">{project.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Technologies used in ${project.title}`}>
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {project.page && (
                  <a
                    href={`/projects/${project.slug}/`}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-violet px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Read case study
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} on GitHub`}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-bg"
                >
                  GitHub
                </a>
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open the live demo for ${project.title}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-bg"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" /> Live
                    Demo
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-8 rounded-xl border border-border bg-card/50 p-6 text-muted">
          No projects match that search. Try a broader term such as{" "}
          <button
            type="button"
            className="text-cyan underline"
            onClick={() => {
              setQuery("")
              setActive("ALL")
            }}
          >
            AI or Python
          </button>
          .
        </p>
      )}
    </section>
  )
}
