import { useEffect, useId, useRef, useState } from "react"
import { ArrowRight, Bot, Mail, Sparkles, X } from "lucide-react"

type RobotAssistantPanelProps = {
  open: boolean
  onClose: () => void
}

const DESTINATIONS = [
  {
    label: "Explore My Projects",
    href: "#projects",
    response: "Opening the project showcase. There you'll find production-ready AI systems and agents.",
    icon: Sparkles,
  },
  {
    label: "View My Skills",
    href: "#skills",
    response: "Taking you to the technical skills section, from machine learning to full-stack AI engineering.",
    icon: Bot,
  },
  {
    label: "Contact Fahad",
    href: "#contact",
    response: "Opening the contact section. You can reach Fahad by email, WhatsApp, LinkedIn, or GitHub.",
    icon: Mail,
  },
] as const

const WELCOME =
  "Hi! I'm Fahad's AI assistant. What would you like to explore?"

export default function RobotAssistantPanel({
  open,
  onClose,
}: RobotAssistantPanelProps) {
  const [response, setResponse] = useState(WELCOME)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return

    setResponse(WELCOME)
    const previousFocus = document.activeElement as HTMLElement | null
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== "Tab") return

      const container = panelRef.current
      if (!container) return

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null)

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener("keydown", handleKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [onClose, open])

  if (!open) return null

  const handleNavigate = (href: string, nextResponse: string) => {
    setResponse(nextResponse)
    const target = document.querySelector(href)

    if (target) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      })
    }
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      data-robot-ui="true"
      aria-modal="false"
      aria-labelledby={titleId}
      className="robot-panel-enter pointer-events-auto fixed bottom-4 left-4 right-4 z-40 overflow-hidden rounded-2xl border border-border bg-bg/95 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-[368px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-violet/15 blur-3xl" />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/30 bg-gradient-to-br from-primary/20 to-violet/15">
              <Bot className="h-5 w-5 text-cyan" aria-hidden="true" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-cyan shadow-[0_0_8px_rgba(85,214,255,0.8)]" />
            </div>
            <div>
              <h2
                id={titleId}
                className="font-display text-sm font-semibold tracking-wide"
              >
                Fahad AI Assistant
              </h2>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
                Local demo · predefined responses
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close AI assistant panel"
            className="rounded-lg border border-border p-1.5 text-muted transition hover:bg-card hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p
          className="mt-4 text-sm leading-relaxed text-muted"
          aria-live="polite"
        >
          {response}
        </p>

        <div className="mt-4 space-y-2">
          {DESTINATIONS.map((destination) => {
            const Icon = destination.icon

            return (
              <button
                key={destination.href}
                type="button"
                onClick={() =>
                  handleNavigate(destination.href, destination.response)
                }
                className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card/50 px-3.5 py-2.5 text-left text-sm text-accent transition hover:border-primary/50 hover:bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-cyan"
                  aria-hidden="true"
                />
                <span className="flex-1">{destination.label}</span>
                <ArrowRight
                  className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-[10px] leading-relaxed text-muted/80">
          This is a local portfolio assistant with predefined responses. No live
          AI model is connected.
        </p>
      </div>
    </div>
  )
}
