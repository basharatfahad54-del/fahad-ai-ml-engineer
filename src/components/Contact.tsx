import { motion } from "framer-motion"
import { Mail, MessageCircle } from "lucide-react"
import { config } from "../data/config"

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-bg2 to-bg">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr] lg:p-12">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-cyan">Contact</p>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Have an AI Project in Mind?</h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Whether you&apos;re building an AI product, automating a workflow, or looking for an AI engineering professional, let&apos;s discuss what you want to build.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={"mailto:" + config.email} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-violet px-6 py-3 text-sm font-medium text-white">
                <Mail className="h-4 w-4" /> Email Me
              </a>
              <a href={"https://wa.me/" + config.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-accent transition hover:bg-card">
                <MessageCircle className="h-4 w-4" /> Message on WhatsApp
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <a href={config.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border px-5 py-4 transition hover:bg-card">
              <span>LinkedIn</span>
              <span className="text-muted">Connect</span>
            </a>
            <a href={config.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border px-5 py-4 transition hover:bg-card">
              <span>GitHub</span>
              <span className="text-muted">View Profile</span>
            </a>
            <a href={config.upwork} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border px-5 py-4 transition hover:bg-card">
              <span>Hire me on Upwork</span>
              <span className="text-muted">Freelance</span>
            </a>
            <a href={config.fiverr} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-border px-5 py-4 transition hover:bg-card">
              <span>Hire me on Fiverr</span>
              <span className="text-muted">Freelance</span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
