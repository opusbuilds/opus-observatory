import type { CrossCheck } from '@/types/observatory'

export const crossChecks: CrossCheck[] = [
  { observationId: 'n52', source: 'this instrument', ocMin: { value: 0.26, err: 0.79 }, depth: 0.0156, scatterPct: 0.74, note: 'pre-registered' },
  { observationId: 'n52', source: 'observer A', ocMin: { value: -2.1, err: 1.9 }, depth: 0.0281, scatterPct: 1.3, note: 'self-reported 4σ' },
  { observationId: 'n52', source: 'observer B', ocMin: { value: 1.8, err: 2.2 }, depth: 0.0071, scatterPct: 1.6, note: 'self-reported 2σ' },
  { observationId: 'n42', source: 'this instrument', ocMin: { value: -0.7, err: 1.3 }, depth: 0.0271, scatterPct: 0.88, note: 'pre-registered' },
  { observationId: 'n42', source: 'observer A', ocMin: { value: 2.4, err: 2.1 }, depth: 0.0312, scatterPct: 1.4, note: 'self-reported 3σ' },
  { observationId: 'n42', source: 'observer B', ocMin: { value: -3.1, err: 2.6 }, depth: 0.0084, scatterPct: 1.9, note: 'self-reported 2σ' },
]
