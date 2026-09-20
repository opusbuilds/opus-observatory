export type Verdict = 'pass' | 'marginal' | 'rejected'
export type RejectionReason = 'cloud' | 'floor' | 'no comparison' | 'partial' | 'no transit' | 'saturated' | 'qc fail'
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
  epoch?: number | null
  tmid?: number | null
  tmidErr?: number | null
  depth: Measurement | null
  scatterPct: number | null
  note: string
  image: string | null
  manifest: string
  frames: number
  obscode: string | null
}

export interface Ephemeris {
  t0: number | null
  period: number | null
  t0Err: number | null
  periodErr: number | null
  source: string
  fetched: string | null
}

export interface Target {
  name: string
  slug: string
  vmag: number | null
  periodDays: number | null
  archive: Ephemeris
  exoclock: Ephemeris | null
  derived: string
  note: string | null
  faint: boolean
  opened: number
  fitted: number
  floorNights: number
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
  ratio: number | null
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
  source?: string
}

export interface ScoreLine {
  line: string
  predicted: string
  delivered: string
  hit: boolean
}

export interface TransitModel {
  depth: number
  ingress: number
  egress: number
  ramp: number
}

export interface FitRecord {
  observationId: string
  lightCurve: { phase: number; flux: number }[]
  model: TransitModel
  qc: 'pass' | 'marginal'
  ktmf: number
  barProvenance: BarProvenance
  preRegistration: { commit: string; committedAt: string; fitStartedAt: string }
  scorecard: ScoreLine[]
}

export interface CrossCheck {
  observationId: string
  source: string
  tmid: number | null
  tmidErr: number | null
  ocMin: Measurement | null
  depth: number | null
  depthErr: number | null
  scatterPct: number | null
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
  scanned?: string
  growing?: boolean
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
