import { useState } from "react"
import { Menu, X } from "lucide-react"

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/60 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a
          href="#home"
          className="font-display text-lg font-semibold"
          aria-label="Fahad AI home"
        >
          Fahad <span className="text-cyan">AI</span>
        </a>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 text-sm text-muted md:flex"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-card md:inline-flex"
        >
          Get in Touch
        </a>
        <button
          type="button"
          className="rounded-lg border border-border p-2 text-muted transition hover:bg-card hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan md:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="mx-auto max-w-6xl px-6 pb-4 md:hidden"
        >
          <div className="grid gap-1 rounded-xl border border-border bg-card/95 p-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-bg hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-gradient-to-r from-primary to-violet px-3 py-2 text-center text-sm font-medium text-white"
            >
              Get in Touch
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
