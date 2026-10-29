import { config } from "../data/config"

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {config.name}. AI/ML engineering and
          intelligent software.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={config.github}
            target="_blank"
            rel="me noopener noreferrer"
            className="transition hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={config.linkedin}
            target="_blank"
            rel="me noopener noreferrer"
            className="transition hover:text-accent"
          >
            LinkedIn
          </a>
          <a href="#home" className="transition hover:text-accent">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
