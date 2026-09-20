import { seeded } from '@/lib/rng'
import type { Observation, TriageFrame, TriageRecord, VerdictClause } from '@/types/observatory'
import { observations } from './ledger'

const frameCounts: Record<string, number> = {
  n54: 52, n53: 49, n52b: 55, n52: 61, n51: 58, n50: 47, n49: 44, n48: 31, n47: 63,
  n46: 57, n45: 52, n44: 40, n43: 50, n42: 60, n41: 45, n40: 28, n39: 54, n38: 48,
}

const seedPeaks: Record<string, number> = { n54: 141, n53: 163, n52b: 187, n43: 152 }

const window = { start: 0.38, end: 0.78 }

function kind(o: Observation) {
  if (o.reason === 'floor') return 'floor'
  if (o.status === 'rejected') return 'cloud'
  return 'fit'
}

function ut(f: number) {
  const minutes = Math.round(20 * 60 + f * 240)
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function frames(o: Observation, n: number): TriageFrame[] {
  const r = seeded(o.id)
  const k = kind(o)
  const base = k === 'floor' ? (seedPeaks[o.id] ?? 165) : 980
  return Array.from({ length: n }, (_, i) => {
    const f = i / (n - 1)
    const dip = Math.exp(-Math.pow((f - 0.55) / 0.22, 2))
    let stars = 118 + r() * 14
    let flux = base * (1 + (r() - 0.5) * 0.05)
    if (k === 'cloud') {
      stars = stars * (1 - 0.82 * dip) + r() * 10
      flux *= 1 - 0.7 * dip
    }
    if (k === 'fit' && f > window.start && f < window.end) flux *= 0.984
    const grade = stars > 100 ? 'clear' : stars > 50 ? 'thin' : 'opaque'
    return {
      file: `${o.dataset}_${String(i + 1).padStart(3, '0')}.fits`,
      ut: ut(f),
      stars: Math.max(4, Math.round(stars)),
      dx: (r() - 0.5) * 4,
      dy: (r() - 0.5) * 4,
      votes: Math.round(3 + r() * 2),
      targetFlux: Math.round(flux),
      sky: Math.round(40 + r() * 8),
      grade,
    }
  })
}

function clauses(o: Observation, fr: TriageFrame[]): VerdictClause[] {
  const inWindow = fr.filter((_, i) => i / (fr.length - 1) > window.start && i / (fr.length - 1) < window.end).length
  if (o.reason === 'floor') {
    return [
      { name: 'FLOOR', fired: true, text: `target peak ${seedPeaks[o.id]} counts on seed frame; floor is 200. No photometry attempted.` },
      { name: 'CLOUD', fired: false, text: 'not evaluated: floor fired first.' },
    ]
  }
  if (o.reason === 'cloud') {
    return [
      { name: 'CLOUD', fired: true, text: `stars-per-frame fell below 40% of clear reference for ${Math.round(inWindow * 0.66)} of ${inWindow} in-window frames.` },
      { name: 'FLOOR', fired: false, text: 'target above floor on clear frames (no indictment of the star).' },
    ]
  }
  if (o.reason === 'no comparison') {
    return [
      { name: 'COMPARISON', fired: true, text: '0 comparisons stayed in the box after frame 31 (meridian flip). Photometry requires ≥1.' },
      { name: 'CLOUD', fired: false, text: 'sky acceptable.' },
      { name: 'FLOOR', fired: false, text: 'target above floor.' },
    ]
  }
  if (o.reason === 'egress-only') {
    return [
      { name: 'GEOMETRY', fired: true, text: 'window opens after ingress; egress-only coverage cannot constrain the mid-time. Not opened for fitting.' },
    ]
  }
  const minFlux = Math.min(...fr.map((x) => x.targetFlux))
  return [
    { name: 'CLOUD', fired: false, text: 'pass: stars-per-frame ≥ 85% of clear reference throughout the window.' },
    { name: 'FLOOR', fired: false, text: `pass: target minimum ${minFlux} counts against the 200-count floor.` },
    { name: 'COMPARISON', fired: false, text: 'pass: 3 comparisons within brightness rule, in box all night.' },
    { name: 'GEOMETRY', fired: false, text: `pass: full transit with ${o.target === 'WASP-67 b' ? 38 : 24} min of baseline either side.` },
  ]
}

export const triageRecords: TriageRecord[] = observations.map((o) => {
  const fr = frames(o, frameCounts[o.id] ?? 50)
  const k = kind(o)
  return {
    observationId: o.id,
    frames: fr,
    window,
    clearReference: 124,
    floor: 200,
    seedFrame: 2,
    comparisons: k === 'floor' ? [] : [{ id: 'C1', ratio: 0.8 }, { id: 'C2', ratio: 1.2 }, { id: 'C3', ratio: 1.6 }],
    driftPx: k === 'cloud' ? 2.9 : 4.1,
    clauses: clauses(o, fr),
    verdict: o.status === 'rejected' ? 'REJECT' : 'PROCEED',
  }
})
