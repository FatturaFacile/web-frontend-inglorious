# Benchmarks

The scripts behind [BENCHMARKS.md](../BENCHMARKS.md). They compare this app with the [Angular app](https://github.com/FatturaFacile/web-frontend).

Build this app first:

```sh
pnpm install && pnpm build
```

| Command                 | What it measures                                                                                           | Angular side   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | -------------- |
| `pnpm bench:size`       | Initial and total JS and CSS, raw, gzip and brotli                                                         | Build          |
| `pnpm bench:lighthouse` | Lighthouse on both login pages, median of 5 desktop and 5 mobile runs (needs Google Chrome; a few minutes) | Build          |
| `pnpm bench:loc`        | Lines of code per feature                                                                                  | Source (clone) |
| `pnpm bench:api`        | Distinct framework and library names each app imports                                                      | Source (clone) |
| `pnpm bench:dev`        | Dev server start-up                                                                                        | Source (clone) |

## Where the Angular app comes from

Two environment variables control it:

| Variable      | Default                        | Purpose                                                                   |
| ------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `ANGULAR_DIR` | none                           | A local clone of the Angular app, relative to this repository or absolute |
| `ANGULAR_URL` | `https://dev.fatturafacile.eu` | Where the Angular app is deployed, used when `ANGULAR_DIR` isn't set      |

**Build benchmarks** (`bench:size`, `bench:lighthouse`) work without a clone. They download the build deployed at `ANGULAR_URL` into a temporary folder. The download covers `index.html`, every JS and CSS file reachable from it through static and dynamic imports, and the fonts and images that the CSS references. When `ANGULAR_DIR` is set, they use its `dist/fatturafacile/browser` instead, so build it first (`pnpm build` in the clone).

**Source benchmarks** (`bench:loc`, `bench:api`, `bench:dev`) need a clone:

```sh
git clone https://github.com/FatturaFacile/web-frontend ../web-frontend
pnpm --dir ../web-frontend install
ANGULAR_DIR=../web-frontend pnpm bench:loc
```

## Notes

- `bench:lighthouse` serves both builds with `serve.mjs`, a local static server with compression whose API always answers "not signed in", so no backend is involved. The deployed Angular build is served by this same server rather than measured live. The live server sends files uncompressed and its API isn't stubbed, so a live run wouldn't be comparable. Files that the Angular app loads at runtime, such as translations and images, are fetched from `ANGULAR_URL` the first time they're requested.
- For a cold `bench:dev`, delete `.angular/cache` in `ANGULAR_DIR` and `node_modules/.vite` here first.
