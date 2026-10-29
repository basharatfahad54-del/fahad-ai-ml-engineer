import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  CASE_STUDIES,
  SITE,
  buildNotFoundHtml,
  buildProjectHtml,
  buildRobots,
  buildSitemap,
  buildWebManifest,
} from "./seo-lib.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const publicDir = join(root, "public")
const projectsDir = join(publicDir, "projects")

mkdirSync(publicDir, { recursive: true })
rmSync(projectsDir, { recursive: true, force: true })
mkdirSync(projectsDir, { recursive: true })

writeFileSync(join(publicDir, "robots.txt"), buildRobots(), "utf8")
writeFileSync(join(publicDir, "sitemap.xml"), buildSitemap(), "utf8")
writeFileSync(join(publicDir, "site.webmanifest"), buildWebManifest(), "utf8")
writeFileSync(join(publicDir, "404.html"), buildNotFoundHtml(), "utf8")

for (const project of CASE_STUDIES) {
  const directory = join(projectsDir, project.slug)
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, "index.html"), buildProjectHtml(project), "utf8")
}

console.log(
  `Generated SEO files for ${CASE_STUDIES.length} case studies at ${SITE.url}`,
)
