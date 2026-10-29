import { ArrowRight } from "lucide-react"
import { services } from "../data/services"

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-20">
      <div className="reveal mb-10">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan">Services</p>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
          AI Engineering and Automation Services
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Practical AI engineering, Python development, and full-stack delivery
          for businesses that need working software, not another prototype
          graveyard.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.title}
            className="reveal rounded-2xl border border-border bg-gradient-to-br from-card to-bg2 p-6"
          >
            <h3 className="font-display text-xl font-semibold">
              {service.title}
            </h3>
            <p className="mt-2 text-muted">{service.desc}</p>
          </article>
        ))}
      </div>
      <div className="reveal mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/50 p-6">
        <p className="max-w-xl text-muted">
          Need a Python AI engineer for an agent, RAG application, automation
          workflow, or custom AI web app?
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-violet px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Discuss your project
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
