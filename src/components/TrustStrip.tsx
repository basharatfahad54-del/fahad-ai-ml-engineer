import { Brain, Bot, Eye, Sparkles, Code2 } from "lucide-react"

const items = [
  { icon: Brain, label: "Machine Learning" },
  { icon: Sparkles, label: "Generative AI" },
  { icon: Bot, label: "AI Agents" },
  { icon: Eye, label: "Computer Vision" },
  { icon: Code2, label: "Full-Stack Development" },
]

export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-bg2/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-6 py-4 text-sm text-muted sm:justify-between">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <item.icon className="h-4 w-4 text-cyan" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
