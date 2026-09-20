import { crossChecks } from '@/data/crosschecks'
import { fitRecords } from '@/data/fits'
import { observations, totals } from '@/data/ledger'
import { candidates, listing } from '@/data/listing'
import { ocSeries } from '@/data/oc'
import { faintSentence, targets } from '@/data/targets'
import { triageRecords } from '@/data/triage'

export const api = {
  observations: () => observations,
  observation: (id: string) => observations.find((o) => o.id === id) ?? null,
  observationsFor: (target: string) => observations.filter((o) => o.target === target),
  totals: () => totals,
  targets: () => targets,
  target: (slug: string) => targets.find((t) => t.slug === slug) ?? null,
  targetByName: (name: string) => targets.find((t) => t.name === name) ?? null,
  faintSentence: () => faintSentence,
  ocSeries: (target: string) => ocSeries[target] ?? null,
  triage: (observationId: string) => triageRecords.find((t) => t.observationId === observationId) ?? null,
  fit: (observationId: string) => fitRecords.find((f) => f.observationId === observationId) ?? null,
  crossChecks: (observationId: string) => crossChecks.filter((c) => c.observationId === observationId),
  listing: () => listing,
  candidates: () => candidates,
}
