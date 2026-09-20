import type { CrossCheck, Ephemeris, FitRecord, ListingNight, Observation, OcPoint, OcSeries, Target, Totals, TriageRecord } from '@/types/observatory'

const BASE = 'https://opusgarden.dev/data/observatory'
const MIN_PER_DAY = 1440

const published = {
  observations: [] as Observation[],
  targets: [] as Target[],
  totals: { opened: 0, fitted: 0, passing: 0, submitted: 0 } as Totals,
  crossChecks: [] as CrossCheck[],
  listing: [] as ListingNight[],
  triage: new Map<string, TriageRecord>(),
  fits: new Map<string, FitRecord>(),
}
export const source = { live: false, generated: '' }

async function json<T>(name: string): Promise<T> {
  const r = await fetch(`${BASE}/${name}`, { cache: 'no-cache' })
  if (!r.ok) throw new Error(`${name}: ${r.status}`)
  return r.json() as Promise<T>
}

export async function loadPublished() {
  const [observations, targets, totals, index, crossChecks, listing] = await Promise.all([
    json<Observation[]>('observations.json'),
    json<Target[]>('targets.json'),
    json<Totals>('totals.json'),
    json<{ generated: string }>('index.json'),
    json<CrossCheck[]>('crosschecks.json').catch(() => [] as CrossCheck[]),
    json<ListingNight[]>('listing.json').catch(() => [] as ListingNight[]),
  ])
  published.crossChecks = crossChecks
  published.listing = listing
  const ids = await json<string[]>('triage/index.json').catch(() => [] as string[])
  const records = await Promise.all(ids.map((id) => json<TriageRecord>(`triage/${id}.json`).catch(() => null)))
  for (const r of records) if (r) published.triage.set(r.observationId, r)
  const fitIds = await json<string[]>('fits/index.json').catch(() => [] as string[])
  const fits = await Promise.all(fitIds.map((id) => json<FitRecord>(`fits/${id}.json`).catch(() => null)))
  for (const r of fits) if (r) published.fits.set(r.observationId, r)
  published.observations = observations
  published.targets = targets
  published.totals = totals
  source.live = true
  source.generated = index.generated
}

type Usable = Ephemeris & { t0: number; period: number }
const usable = (e: Ephemeris | null): e is Usable => !!e && e.t0 !== null && e.period !== null
const predict = (e: Usable, epoch: number) => e.t0 + epoch * e.period
const bandMin = (e: Ephemeris, epoch: number) => Math.hypot(e.t0Err ?? 0, epoch * (e.periodErr ?? 0)) * MIN_PER_DAY

function ocSeries(name: string): OcSeries | null {
  const t = published.targets.find((x) => x.name === name)
  const rows = published.observations.filter((o) => o.target === name && o.status !== 'rejected' && o.ocMin && o.epoch != null)
  if (!t || !rows.length || !usable(t.archive)) return null
  const archive = t.archive
  const exo = usable(t.exoclock) ? t.exoclock : null
  const nearest = (e: Usable, when: number) => predict(e, Math.round((when - e.t0) / e.period))
  const shift = (epoch: number) => {
    if (!exo) return 0
    const when = predict(archive, epoch)
    return (when - nearest(exo, when)) * MIN_PER_DAY
  }
  const epochs = rows.map((r) => r.epoch as number)
  const lo = Math.min(...epochs) - 20
  const hi = Math.max(...epochs) + 20
  const points: OcPoint[] = rows.map((r) => {
    const oc = r.ocMin as { value: number; err: number }
    const epoch = r.epoch as number
    const value = exo && r.tmid != null ? (r.tmid - nearest(exo, r.tmid)) * MIN_PER_DAY : oc.value
    return { epoch, ocMin: { value: +value.toFixed(2), err: oc.err }, hollow: false }
  })
  const hollow: OcPoint[] = rows.flatMap((r) =>
    published.crossChecks
      .filter((c) => c.observationId === r.id && c.ocMin && c.tmid != null)
      .map((c) => {
        const oc = c.ocMin as { value: number; err: number }
        const value = exo ? ((c.tmid as number) - nearest(exo, c.tmid as number)) * MIN_PER_DAY : oc.value
        return { epoch: r.epoch as number, ocMin: { value: +value.toFixed(2), err: oc.err }, hollow: true }
      }),
  )
  const archiveDrift = exo
    ? Array.from({ length: 41 }, (_, i) => {
        const epoch = lo + ((hi - lo) * i) / 40
        return { epoch, ocMin: +shift(epoch).toFixed(2), bandMin: +bandMin(archive, epoch).toFixed(2) }
      })
    : []
  return { epochRange: [lo, hi], exoclockBandMin: +bandMin(exo ?? archive, (lo + hi) / 2).toFixed(2), archiveDrift, points: [...points, ...hollow] }
}

const faintSentence =
  'This star is too faint for this telescope to time. The nights are recorded so the pattern is visible, not because they will ever yield a point.'

export const api = {
  observations: () => published.observations,
  observation: (id: string) => published.observations.find((o) => o.id === id) ?? null,
  observationsFor: (target: string) => published.observations.filter((o) => o.target === target),
  totals: () => published.totals,
  targets: () => published.targets,
  target: (slug: string) => published.targets.find((t) => t.slug === slug) ?? null,
  targetByName: (name: string) => published.targets.find((t) => t.name === name) ?? null,
  faintSentence: () => faintSentence,
  ocSeries,
  triage: (observationId: string): TriageRecord | null => published.triage.get(observationId) ?? null,
  fit: (observationId: string): FitRecord | null => published.fits.get(observationId) ?? null,
  crossChecks: (observationId: string): CrossCheck[] => published.crossChecks.filter((c) => c.observationId === observationId),
  listing: () => published.listing,
}
