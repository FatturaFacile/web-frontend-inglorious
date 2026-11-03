// The Angular production build to measure: the clone's `dist` when
// ANGULAR_DIR is set (build it first), or else a copy of the build deployed at
// ANGULAR_URL. The copy holds index.html and every JS and CSS file reachable
// from it through static and dynamic imports, plus the fonts and images the
// CSS references, so both builds can be measured and served the same way.
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"

import { ANGULAR_DIST, ANGULAR_URL } from "./paths.mjs"

const IMPORT = /(?:\bfrom|\bimport)\s*\(?\s*["'`]([^"'`]+\.js)["'`]/g
const CSS_URL = /url\(\s*["']?([^"')]+)["']?\s*\)/g
const HTML_ASSET =
  /<(?:script|link)[^>]*(?:src|href)="([^"]+\.(?:js|css|ico|webmanifest|png|svg))"/g

/** A local directory holding the Angular build, and where it came from. */
export async function angularBuild() {
  if (ANGULAR_DIST) {
    if (!existsSync(join(ANGULAR_DIST, "index.html"))) {
      console.error(
        `No Angular build in ${ANGULAR_DIST}: run \`pnpm build\` in ANGULAR_DIR first.`,
      )
      process.exit(1)
    }
    return { dist: ANGULAR_DIST, source: ANGULAR_DIST }
  }
  const dist = mkdtempSync(join(tmpdir(), "angular-build-"))
  await mirror(new URL("/", ANGULAR_URL), dist)
  return { dist, source: ANGULAR_URL }
}

async function mirror(base, dist) {
  const seen = new Set()

  const download = async (url) => {
    if (url.origin !== base.origin || seen.has(url.pathname)) return
    seen.add(url.pathname)
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`Skipped ${url.href}: ${response.status}`)
      return
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    const path = join(dist, decodeURIComponent(url.pathname))
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, buffer)

    const pattern = url.pathname.endsWith(".js")
      ? IMPORT
      : url.pathname.endsWith(".css")
        ? CSS_URL
        : null
    if (!pattern) return
    const text = buffer.toString("utf8")
    await Promise.all(
      [...text.matchAll(pattern)]
        .map(([, spec]) => spec)
        .filter((spec) => !spec.startsWith("data:"))
        .map((spec) => download(new URL(spec, url))),
    )
  }

  const response = await fetch(new URL("/login", base))
  if (!response.ok) throw new Error(`${base.href} answered ${response.status}`)
  const html = await response.text()
  writeFileSync(join(dist, "index.html"), html)
  await Promise.all(
    [...new Set([...html.matchAll(HTML_ASSET)].map(([, href]) => href))].map(
      (href) => download(new URL(href, base)),
    ),
  )
}
