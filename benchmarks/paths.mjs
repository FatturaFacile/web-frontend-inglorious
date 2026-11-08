import { existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

/** This repository: the Inglorious app. */
export const INGLORIOUS = join(dirname(fileURLToPath(import.meta.url)), "..")
export const INGLORIOUS_DIST = join(INGLORIOUS, "dist")

/**
 * A local clone of the Angular app (https://github.com/FatturaFacile/web-frontend),
 * when `ANGULAR_DIR` names one, relative to this repository or absolute.
 */
export const ANGULAR = process.env.ANGULAR_DIR
  ? resolve(INGLORIOUS, process.env.ANGULAR_DIR)
  : undefined
export const ANGULAR_DIST =
  ANGULAR && join(ANGULAR, "dist", "fatturafacile", "browser")

/** Where the Angular app is deployed: the build to measure without a clone. */
export const ANGULAR_URL =
  process.env.ANGULAR_URL ?? "https://dev.fatturafacile.eu"

/** The Angular clone, for the benchmarks that need its source; exits without one. */
export function requireAngularSource() {
  if (ANGULAR && existsSync(join(ANGULAR, "angular.json"))) return ANGULAR
  console.error(
    ANGULAR
      ? `ANGULAR_DIR=${process.env.ANGULAR_DIR} is not an Angular workspace (no angular.json in ${ANGULAR}).`
      : "This benchmark reads the Angular app's source: set ANGULAR_DIR to a clone of https://github.com/FatturaFacile/web-frontend, e.g. ANGULAR_DIR=../web-frontend.",
  )
  process.exit(1)
}
