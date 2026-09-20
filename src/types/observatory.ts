export type Verdict = 'pass' | 'marginal' | 'rejected'
export type RejectionReason = 'cloud' | 'floor' | 'no comparison' | 'egress-only'
export type FrameGrade = 'clear' | 'thin' | 'opaque'
export type BarProvenance = 'posterior' | 'replaced'

export interface Measurement {
  value: number
  err: number
}

export interface Observation {
  id: string
  target: string
  obsDate: string
  dataset: string
  status: Verdict
  reason: RejectionReason | null
  ocMin: Measurement | null
  depth: Measurement | null
  scatterPct: number | null
  note: string
  image: string | null
  manifest: string
  obscode: string | null
}

export interface Ephemeris {
  t0: number
  period: number
  t0Err: number
  periodErr: number
  source: string
  fetched: string
}

export interface Target {
  name: string
  slug: string
  vmag: number
  periodDays: number
  archive: Ephemeris
  exoclock: Ephemeris
  derived: string
  note: string | null
  faint: boolean
}

export interface TriageFrame {
  file: string
  ut: string
  stars: number
  dx: number
  dy: number
  votes: number
  targetFlux: number
  sky: number
  grade: FrameGrade
}

export interface Comparison {
  id: string
  ratio: number
}

export interface VerdictClause {
  name: string
  fired: boolean
  text: string
}

export interface TriageRecord {
  observationId: string
  frames: TriageFrame[]
  window: { start: number; end: number }
  clearReference: number
  floor: number
  seedFrame: number
  comparisons: Comparison[]
  driftPx: number
  clauses: VerdictClause[]
  verdict: 'PROCEED' | 'REJECT'
}

export interface ScoreLine {
  line: string
  predicted: string
  delivered: string
  hit: boolean
}

export interface FitRecord {
  observationId: string
  lightCurve: { phase: number; flux: number }[]
  model: { depth: number; ingress: number; egress: number; ramp: number }
  qc: 'pass' | 'marginal'
  ktmf: number
  barProvenance: BarProvenance
  preRegistration: { commit: string; committedAt: string; fitStartedAt: string }
  scorecard: ScoreLine[]
}

export interface CrossCheck {
  observationId: string
  source: string
  ocMin: Measurement
  depth: number
  scatterPct: number
  note: string
}

export interface OcPoint {
  epoch: number
  ocMin: Measurement
  hollow: boolean
}

export interface OcSeries {
  epochRange: [number, number]
  exoclockBandMin: number
  archiveDrift: { epoch: number; ocMin: number; bandMin: number }[]
  points: OcPoint[]
}

export interface ListingEntry {
  target: string
  geometry: string
  observationId: string | null
  notOpened: string | null
}

export interface ListingNight {
  date: string
  entries: ListingEntry[]
}

export interface Candidate {
  target: string
  geometry: string
  launchable: boolean
}

export interface Totals {
  opened: number
  fitted: number
  passing: number
  submitted: number
}
