export default function Navbar() {
  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/60 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#home" className="font-display text-lg font-semibold">Fahad <span className="text-cyan">AI</span></a>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-card md:inline-flex">
          Get in Touch
        </a>
      </div>
    </header>
  )
}
