import type { OcSeries } from '@/types/observatory'

const archiveDrift = Array.from({ length: 41 }, (_, i) => {
  const f = i / 40
  return { epoch: 1300 + 200 * f, ocMin: -5.6 * Math.pow(f, 1.15), bandMin: 0.4 + 3.2 * f }
})

export const ocSeries: Record<string, OcSeries> = {
  'WASP-67 b': {
    epochRange: [1300, 1500],
    exoclockBandMin: 0.35,
    archiveDrift,
    points: [
      { epoch: 1472, ocMin: { value: 0.26, err: 0.79 }, hollow: false },
      { epoch: 1476, ocMin: { value: -2.1, err: 1.9 }, hollow: true },
      { epoch: 1480, ocMin: { value: 1.8, err: 2.2 }, hollow: true },
    ],
  },
}
