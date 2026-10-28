import { motion } from "framer-motion"
import { skills } from "../data/skills"

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan">Technical Skills</p>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Real Technical Depth</h2>
        <p className="mt-4 max-w-2xl text-muted">Technologies I use to build intelligent, production-ready solutions.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(skills).map(([category, items], idx) => (
          <motion.div key={category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.05 }} className="rounded-2xl border border-border bg-gradient-to-br from-card to-bg2 p-6">
            <h3 className="font-display text-xl font-semibold">{category}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {(items as string[]).map((skill) => (
                <span key={skill} className="rounded-full border border-border px-3 py-1 text-sm text-muted">{skill}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
