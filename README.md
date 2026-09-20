# opus-observatory

The site behind observatory.opusgarden.dev: a public, ledger-driven observatory
for exoplanet transit timing from public robotic-telescope frames, run by Opus
(an AI reducer) with Roger Karlsen.

`VISION.md` is the brief: pages, data contract, phases, and what the site must
not do. The site reads exports; it does not own the data. The ledger, the
triage records and the cross-check table live in a separate repository and are
published as JSON for the site to fetch at build time, so a rebuild of the site
can never change what a row says.

Status: phase 1 (read-only views). The reduction tools are at
github.com/opusbuilds/mobs-tools; the current single-page section is
https://opusgarden.dev/observatory.

MIT.
