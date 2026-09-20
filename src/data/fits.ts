import { plain, signed } from '@/lib/format'
import { seeded } from '@/lib/rng'
import { transitFlux } from '@/lib/transit'
import type { FitRecord, Measurement, Observation, ScoreLine, TransitModel } from '@/types/observatory'
import { observations } from './ledger'

function modelFor(o: Observation): TransitModel {
  return { depth: o.depth?.value ?? 0.0156, ingress: 0.4, egress: 0.76, ramp: 0.045 }
}

function lightCurve(o: Observation) {
  const r = seeded(`${o.id}lc`)
  const sc = (o.scatterPct ?? 0.9) / 100
  return Array.from({ length: 70 }, (_, i) => {
    const phase = i / 69
    return { phase, flux: transitFlux(phase, modelFor(o)) + (r() - 0.5) * 2 * sc * 0.8 }
  })
}

function hash(o: Observation) {
  const r = seeded(`${o.id}hash`)
  return Array.from({ length: 7 }, () => '0123456789abcdef'[Math.floor(r() * 16)]).join('')
}

function sigma(m: Measurement) {
  return plain(Math.abs(m.value) / m.err, 1)
}

function scorecard(o: Observation, oc: Measurement, scatter: number): ScoreLine[] {
  const midTime = `${signed(oc.value)} min at ±${plain(oc.err)}, ${sigma(oc)}σ`
  if (o.status === 'pass') {
    return [
      { line: 'QC verdict', predicted: 'pass, cloud and floor clear by margin', delivered: 'pass', hit: true },
      { line: 'scatter', predicted: '≤ 0.9% (calibration, 3 points)', delivered: `${plain(scatter)}%`, hit: scatter <= 0.9 },
      { line: 'bar provenance', predicted: 'posterior, not replaced', delivered: 'posterior', hit: true },
      { line: 'mid-time within one bar', predicted: 'yes; a miss on a clean night indicts the archive period, not the night', delivered: midTime, hit: Math.abs(oc.value) <= oc.err },
      { line: 'depth within one sigma', predicted: 'yes', delivered: '1.4σ high of archive value', hit: false },
      { line: 'named risk', predicted: 'comparison drift in second half', delivered: 'did not appear', hit: true },
    ]
  }
  return [
    { line: 'QC verdict', predicted: 'marginal risk from pointing', delivered: 'marginal', hit: true },
    { line: 'scatter', predicted: '≤ 1.1%', delivered: `${plain(scatter)}%; calibration optimistic`, hit: scatter <= 1.1 },
    { line: 'bar provenance', predicted: 'posterior', delivered: 'posterior', hit: true },
    { line: 'mid-time within one bar', predicted: 'yes', delivered: midTime, hit: Math.abs(oc.value) <= oc.err },
    { line: 'depth within one sigma', predicted: 'yes', delivered: '0.7σ', hit: true },
    { line: 'named risk', predicted: 'pointing jump at flip loses ingress', delivered: 'appeared; MARGINAL from here, as named', hit: true },
  ]
}

export const fitRecords: FitRecord[] = observations
  .filter((o) => o.status !== 'rejected' && o.ocMin && o.scatterPct !== null)
  .map((o) => ({
    observationId: o.id,
    lightCurve: lightCurve(o),
    model: modelFor(o),
    qc: o.status === 'pass' ? 'pass' : 'marginal',
    ktmf: o.status === 'pass' ? 0.91 : 0.62,
    barProvenance: 'posterior',
    preRegistration: {
      commit: hash(o),
      committedAt: `${o.obsDate} 21:42 UT`,
      fitStartedAt: `${o.obsDate} 21:58 UT`,
    },
    scorecard: scorecard(o, o.ocMin!, o.scatterPct!),
  }))
