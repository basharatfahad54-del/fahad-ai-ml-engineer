import { skills } from "../data/skills"

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
      <div className="reveal mb-10">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan">Technical Skills</p>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
          Python, Generative AI, and ML Engineering
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          The technologies I use to build AI agents, RAG systems, machine
          learning applications, FastAPI services, and production-ready
          full-stack software.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(skills).map(([category, items]) => (
          <div
            key={category}
            className="reveal rounded-2xl border border-border bg-gradient-to-br from-card to-bg2 p-6"
          >
            <h3 className="font-display text-xl font-semibold">{category}</h3>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={category}>
              {(items as string[]).map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
