import { config } from "../data/config"

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} {config.name}. All rights reserved.</p>
        <a href="#home" className="transition hover:text-accent">Back to top</a>
      </div>
    </footer>
  )
}
