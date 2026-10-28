import { motion } from "framer-motion"
import { services } from "../data/services"

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan">Services</p>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">What I Can Build For You</h2>
        <p className="mt-4 max-w-2xl text-muted">Pragmatic AI engineering and full-stack development for products and businesses.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, idx) => (
          <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.04 }} className="rounded-2xl border border-border bg-gradient-to-br from-card to-bg2 p-6">
            <h3 className="font-display text-xl font-semibold">{service.title}</h3>
            <p className="mt-2 text-muted">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
