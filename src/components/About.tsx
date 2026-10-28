import { motion } from "framer-motion"

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="text-sm uppercase tracking-[0.4em] text-cyan">About</p>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">From Ideas to Intelligent Applications</h2>
        <div className="mt-6 grid gap-6 text-lg text-muted lg:grid-cols-2">
          <p>
            I&apos;m Engr. Muhammad Fahad, a Microsoft &amp; Huawei Certified AI/ML Engineer focused on practical AI engineering and intelligent software development. I build AI applications, autonomous agents, automation systems, and Python-based software designed to work reliably in the real world.
          </p>
          <p>
            I translate business problems into technical solutions - designing AI architectures, integrating LLMs and APIs, building RAG systems and agents, developing robust backends, and shipping full-stack AI-powered applications with a focus on clarity and reliability.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
