import { ArrowRight } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <div className="reveal">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan">About</p>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">From Ideas to Intelligent Applications</h2>
        <div className="mt-6 grid gap-6 text-lg text-muted lg:grid-cols-2">
          <p>
            I&apos;m Engr. Muhammad Fahad, a Microsoft &amp; Huawei certified
            AI/ML engineer focused on practical AI engineering and intelligent
            software development. I build AI applications, autonomous agents,
            automation systems, and Python-based software designed to work
            reliably in the real world.
          </p>
          <p>
            I translate business problems into technical solutions by designing
            AI architectures, integrating LLMs and APIs, building RAG systems
            and agents, developing robust FastAPI backends, and shipping
            full-stack AI-powered applications. My work centers on clarity,
            explainability, and reliable delivery.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a
            href="#projects"
            className="group flex items-center justify-between rounded-xl border border-border bg-card/50 px-4 py-3 text-sm transition hover:bg-card"
          >
            <span>See the AI systems I have built</span>
            <ArrowRight className="h-4 w-4 text-cyan transition group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            href="#services"
            className="group flex items-center justify-between rounded-xl border border-border bg-card/50 px-4 py-3 text-sm transition hover:bg-card"
          >
            <span>AI engineering services for businesses</span>
            <ArrowRight className="h-4 w-4 text-cyan transition group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
