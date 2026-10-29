import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

export const SITE = JSON.parse(
  readFileSync(join(root, "src/data/site.json"), "utf8"),
)
export const PROJECTS = JSON.parse(
  readFileSync(join(root, "src/data/projects.json"), "utf8"),
)

const configuredUrl =
  process.env.VITE_SITE_URL || process.env.SITE_URL || SITE.url
SITE.url = configuredUrl.endsWith("/") ? configuredUrl : `${configuredUrl}/`

export const CASE_STUDIES = PROJECTS.filter((project) => project.page)
export const OG_IMAGE = `${SITE.url}og-image.jpg`
export const PORTRAIT_IMAGE = `${SITE.url}fahad-portrait.jpg`

export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  )
}

export function escapeXml(value) {
  return escapeHtml(value)
}

export function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

export function absoluteUrl(path = "") {
  if (/^https?:\/\//.test(path)) return path
  return new URL(path.replace(/^\/+/, ""), SITE.url).href
}

export function projectPath(slug) {
  return `/projects/${slug}/`
}

export function projectUrl(slug) {
  return absoluteUrl(projectPath(slug))
}

export const PERSON_ID = `${SITE.url}#person`
export const WEBSITE_ID = `${SITE.url}#website`
export const PROFILE_PAGE_ID = `${SITE.url}#webpage`

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.name,
    url: SITE.url,
    image: PORTRAIT_IMAGE,
    jobTitle: SITE.jobTitle,
    description: SITE.shortDescription,
    email: `mailto:${SITE.email}`,
    sameAs: SITE.socialProfiles,
    knowsAbout: SITE.knowsAbout,
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: SITE.certification,
      credentialCategory: "certification",
    },
  }
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personSchema(),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE.url,
        name: SITE.shortName,
        description: SITE.shortDescription,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": PROFILE_PAGE_ID,
        url: SITE.url,
        name: SITE.title,
        description: SITE.description,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        mainEntity: { "@id": PERSON_ID },
        inLanguage: "en",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: OG_IMAGE,
          width: 1200,
          height: 630,
        },
      },
    ],
  }
}

function analyticsHead(env) {
  const verification =
    env.VITE_GOOGLE_SITE_VERIFICATION ||
    env.GOOGLE_SITE_VERIFICATION
  const plausibleDomain =
    env.VITE_PLAUSIBLE_DOMAIN || env.PLAUSIBLE_DOMAIN

  return [
    verification
      ? `<meta name="google-site-verification" content="${escapeHtml(verification)}">`
      : "",
    plausibleDomain
      ? `<script defer data-domain="${escapeHtml(plausibleDomain)}" src="https://plausible.io/js/script.js"></script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ")
}

export function buildHomeHead(env = process.env) {
  return `<title>${escapeHtml(SITE.title)}</title>
    <meta name="description" content="${escapeHtml(SITE.description)}">
    <meta name="author" content="${escapeHtml(SITE.name)}">
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
    <link rel="canonical" href="${escapeHtml(SITE.url)}">
    <meta property="og:locale" content="en_US">
    <meta property="og:type" content="profile">
    <meta property="og:site_name" content="${escapeHtml(SITE.shortName)}">
    <meta property="og:title" content="${escapeHtml(SITE.title)}">
    <meta property="og:description" content="${escapeHtml(SITE.description)}">
    <meta property="og:url" content="${escapeHtml(SITE.url)}">
    <meta property="og:image" content="${escapeHtml(OG_IMAGE)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${escapeHtml(`Portfolio of ${SITE.name}, ${SITE.jobTitle}`)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(SITE.title)}">
    <meta name="twitter:description" content="${escapeHtml(SITE.description)}">
    <meta name="twitter:image" content="${escapeHtml(OG_IMAGE)}">
    <meta name="twitter:image:alt" content="${escapeHtml(`Portfolio of ${SITE.name}, ${SITE.jobTitle}`)}">
    <meta name="theme-color" content="#080B12">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    ${analyticsHead(env)}
    <script type="application/ld+json">${jsonLd(homeJsonLd())}</script>`
}

function projectJsonLd(project) {
  const url = projectUrl(project.slug)
  const related = CASE_STUDIES.filter((item) => item.slug !== project.slug)

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        "@id": `${url}#project`,
        name: project.title,
        description: project.page.metaDescription,
        url,
        codeRepository: project.github,
        programmingLanguage: project.tech,
        author: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        about: project.page.keywords.map((keyword) => ({
          "@type": "Thing",
          name: keyword,
        })),
        keywords: project.page.keywords.join(", "),
        isAccessibleForFree: true,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${SITE.url}#projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: url,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: project.page.seoTitle,
        description: project.page.metaDescription,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": `${url}#project` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: OG_IMAGE,
          width: 1200,
          height: 630,
        },
      },
    ].concat(
      related.length
        ? [
            {
              "@type": "ItemList",
              name: "Related AI and machine learning projects",
              itemListElement: related.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: projectUrl(item.slug),
                name: item.title,
              })),
            },
          ]
        : [],
    ),
  }
}

function headerMarkup() {
  return `<header class="site-header">
      <div class="shell header-inner">
        <a class="brand" href="/" aria-label="Fahad AI home">Fahad <span>AI</span></a>
        <nav aria-label="Primary navigation">
          <a href="/#about">About</a>
          <a href="/#projects">Projects</a>
          <a href="/#services">Services</a>
          <a href="/#contact">Contact</a>
        </nav>
      </div>
    </header>`
}

function footerMarkup() {
  return `<footer class="site-footer">
      <div class="shell footer-inner">
        <p>&copy; ${new Date().getFullYear()} ${escapeHtml(SITE.name)}. ${escapeHtml(SITE.certification)}.</p>
        <div class="footer-links">
          <a href="/#projects">Projects</a>
          <a href="${escapeHtml(SITE.github)}" rel="me noopener">GitHub</a>
          <a href="${escapeHtml(SITE.linkedin)}" rel="me noopener">LinkedIn</a>
          <a href="/#contact">Contact</a>
        </div>
      </div>
    </footer>`
}

function projectCardMarkup(project) {
  return `<a class="related-card" href="${escapeHtml(projectPath(project.slug))}">
          <span class="eyebrow">${escapeHtml(project.category)}</span>
          <strong>${escapeHtml(project.title)}</strong>
          <span>${escapeHtml(project.page.summary)}</span>
        </a>`
}

export function buildProjectHtml(project) {
  const page = project.page
  const url = projectUrl(project.slug)
  const related = CASE_STUDIES.filter((item) => item.slug !== project.slug)
  const title = project.page.seoTitle

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(page.metaDescription)}">
    <meta name="author" content="${escapeHtml(SITE.name)}">
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
    <link rel="canonical" href="${escapeHtml(url)}">
    <meta property="og:locale" content="en_US">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="${escapeHtml(SITE.shortName)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(page.metaDescription)}">
    <meta property="og:url" content="${escapeHtml(url)}">
    <meta property="og:image" content="${escapeHtml(OG_IMAGE)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${escapeHtml(`${project.title} - case study by ${SITE.name}`)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(page.metaDescription)}">
    <meta name="twitter:image" content="${escapeHtml(OG_IMAGE)}">
    <meta name="theme-color" content="#080B12">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="stylesheet" href="/seo.css">
    <script type="application/ld+json">${jsonLd(projectJsonLd(project))}</script>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    ${headerMarkup()}
    <main id="main-content" class="shell">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/#projects">Projects</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${escapeHtml(project.title)}</span>
      </nav>

      <article>
        <header class="article-hero">
          <p class="eyebrow">${escapeHtml(project.category)} &middot; Case study</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="lead">${escapeHtml(page.summary)}</p>
          <ul class="pill-list" aria-label="Technologies used">
            ${project.tech.map((tech) => `<li>${escapeHtml(tech)}</li>`).join("\n            ")}
          </ul>
          <div class="cta-row">
            <a class="button primary" href="${escapeHtml(project.github)}" rel="noopener">View the source on GitHub</a>
            <a class="button" href="/#contact">Discuss a similar project</a>
          </div>
        </header>

        <div class="article-grid">
          <div class="article-body">
            <section aria-labelledby="problem-heading">
              <h2 id="problem-heading">The problem</h2>
              <p>${escapeHtml(page.problem)}</p>
            </section>

            <section aria-labelledby="approach-heading">
              <h2 id="approach-heading">How it works</h2>
              <ul class="detail-list">
                ${page.approach.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                ")}
              </ul>
            </section>

            <section aria-labelledby="architecture-heading">
              <h2 id="architecture-heading">Architecture</h2>
              <ul class="detail-list">
                ${page.architecture.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                ")}
              </ul>
            </section>

            <section aria-labelledby="evidence-heading">
              <h2 id="evidence-heading">Repository evidence</h2>
              <ul class="detail-list evidence">
                ${page.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                ")}
              </ul>
            </section>

            <section aria-labelledby="scope-heading">
              <h2 id="scope-heading">Limitations and scope</h2>
              <ul class="detail-list">
                ${page.limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n                ")}
              </ul>
              <p class="note">Claims on this page are limited to the public repository scope. Metrics and capabilities are attributed to the project documentation rather than presented as independently audited benchmarks.</p>
            </section>
          </div>

          <aside class="article-sidebar" aria-label="Project details">
            <div class="side-card">
              <p class="eyebrow">Project links</p>
              <a href="${escapeHtml(project.github)}" rel="noopener">GitHub repository</a>
              <a href="/#projects">All projects</a>
              <a href="${escapeHtml(SITE.linkedin)}" rel="me noopener">LinkedIn</a>
            </div>
            <div class="side-card">
              <p class="eyebrow">Focus areas</p>
              <ul class="sidebar-tags">
                ${page.keywords.map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join("\n                ")}
              </ul>
            </div>
            <div class="side-card">
              <p class="eyebrow">Need something similar?</p>
              <p>Fahad builds Python AI applications, agents, RAG systems, and FastAPI backends.</p>
              <a class="button primary full" href="/#contact">Start a conversation</a>
            </div>
          </aside>
        </div>
      </article>

      <section class="related-section" aria-labelledby="related-heading">
        <p class="eyebrow">More work</p>
        <h2 id="related-heading">Related projects</h2>
        <div class="related-grid">
          ${related.map(projectCardMarkup).join("\n          ")}
        </div>
      </section>
    </main>
    ${footerMarkup()}
  </body>
</html>
`
}

export function buildNotFoundHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page not found | ${escapeHtml(SITE.name)}</title>
    <meta name="description" content="The page you requested does not exist. Explore Fahad's AI/ML engineering projects and services.">
    <meta name="robots" content="noindex,follow">
    <meta name="theme-color" content="#080B12">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="stylesheet" href="/seo.css">
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    ${headerMarkup()}
    <main id="main-content" class="shell not-found">
      <p class="eyebrow">404</p>
      <h1>This page is not in the lab.</h1>
      <p class="lead">The URL may have changed or the page may no longer exist. Return to the portfolio to explore Fahad's AI engineering work.</p>
      <div class="cta-row">
        <a class="button primary" href="/">Back to the portfolio</a>
        <a class="button" href="/#projects">Browse projects</a>
      </div>
    </main>
    ${footerMarkup()}
  </body>
</html>
`
}

export function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE.url}sitemap.xml
`
}

export function buildSitemap() {
  const urls = [SITE.url, ...CASE_STUDIES.map((project) => projectUrl(project.slug))]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url)}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`
}

export function buildWebManifest() {
  return JSON.stringify(
    {
      name: SITE.name,
      short_name: SITE.shortName,
      description: SITE.shortDescription,
      id: "/",
      start_url: "/",
      scope: "/",
      display: "standalone",
      lang: "en",
      dir: "ltr",
      background_color: "#080B12",
      theme_color: "#080B12",
      icons: [
        {
          src: "/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    null,
    2,
  )
}

