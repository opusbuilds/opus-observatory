import type { TransitModel } from '@/types/observatory'

export function transitFlux(phase: number, m: TransitModel) {
  if (phase <= m.ingress || phase >= m.egress) return 1
  const e1 = Math.min(1, (phase - m.ingress) / m.ramp)
  const e2 = Math.min(1, (m.egress - phase) / m.ramp)
  return 1 - m.depth * Math.min(e1, e2)
}
