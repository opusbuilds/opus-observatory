import { seeded } from '@/lib/rng'
import type { FitRecord, Observation, ScoreLine } from '@/types/observatory'
import { observations } from './ledger'

const model = { depth: 0.0156, ingress: 0.4, egress: 0.76, ramp: 0.045 }

export function transitModel(phase: number, m = model) {
  if (phase <= m.ingress || phase >= m.egress) return 1
  const e1 = Math.min(1, (phase - m.ingress) / m.ramp)
  const e2 = Math.min(1, (m.egress - phase) / m.ramp)
  return 1 - m.depth * Math.min(e1, e2)
}

function lightCurve(o: Observation) {
  const r = seeded(`${o.id}lc`)
  const sc = (o.scatterPct ?? 0.9) / 100
  return Array.from({ length: 70 }, (_, i) => {
    const phase = i / 69
    return { phase, flux: transitModel(phase) + (r() - 0.5) * 2 * sc * 0.8 }
  })
}

function hash(o: Observation) {
  const r = seeded(`${o.id}hash`)
  return Array.from({ length: 7 }, () => '0123456789abcdef'[Math.floor(r() * 16)]).join('')
}

function scorecard(o: Observation): ScoreLine[] {
  if (o.status === 'pass') {
    return [
      { line: 'QC verdict', predicted: 'pass, cloud and floor clear by margin', delivered: 'pass', hit: true },
      { line: 'scatter', predicted: '≤ 0.9% (calibration, 3 points)', delivered: '0.74%', hit: true },
      { line: 'bar provenance', predicted: 'posterior, not replaced', delivered: 'posterior', hit: true },
      { line: 'mid-time within one bar', predicted: 'yes; a miss on a clean night indicts the archive period, not the night', delivered: '+0.26 min at ±0.79, 0.3σ', hit: true },
      { line: 'depth within one sigma', predicted: 'yes', delivered: '1.4σ high of archive value', hit: false },
      { line: 'named risk', predicted: 'comparison drift in second half', delivered: 'did not appear', hit: true },
    ]
  }
  return [
    { line: 'QC verdict', predicted: 'marginal risk from pointing', delivered: 'marginal', hit: true },
    { line: 'scatter', predicted: '≤ 1.1%', delivered: '1.9%; calibration optimistic, twice now this week', hit: false },
    { line: 'bar provenance', predicted: 'posterior', delivered: 'posterior', hit: true },
    { line: 'mid-time within one bar', predicted: 'yes', delivered: '−1.4 min at ±2.6, 0.5σ', hit: true },
    { line: 'depth within one sigma', predicted: 'yes', delivered: '0.7σ', hit: true },
    { line: 'named risk', predicted: 'pointing jump at flip loses ingress', delivered: 'appeared; MARGINAL from here, as named', hit: true },
  ]
}

export const fitRecords: FitRecord[] = observations
  .filter((o) => o.status !== 'rejected')
  .map((o) => ({
    observationId: o.id,
    lightCurve: lightCurve(o),
    model,
    qc: o.status === 'pass' ? 'pass' : 'marginal',
    ktmf: o.status === 'pass' ? 0.91 : 0.62,
    barProvenance: 'posterior',
    preRegistration: {
      commit: hash(o),
      committedAt: `${o.obsDate} 21:42 UT`,
      fitStartedAt: `${o.obsDate} 21:58 UT`,
    },
    scorecard: scorecard(o),
  }))
