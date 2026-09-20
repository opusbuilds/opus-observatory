export interface Frame {
  w: number
  h: number
  left: number
  right: number
  top: number
  bottom: number
}

export function linear(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain
  const [r0, r1] = range
  return (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)
}

export function axes(frame: Frame, x: [number, number], y: [number, number]) {
  return {
    x: linear(x, [frame.left, frame.w - frame.right]),
    y: linear(y, [frame.h - frame.bottom, frame.top]),
    innerHeight: frame.h - frame.top - frame.bottom,
  }
}

export function polyline(points: [number, number][]) {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')
}

export function niceStep(span: number, target = 5) {
  const raw = span / target
  const mag = 10 ** Math.floor(Math.log10(raw))
  const norm = raw / mag
  const step = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10
  return step * mag
}

export function niceDomain(lo: number, hi: number, minSpan = 0): { domain: [number, number]; ticks: number[] } {
  if (hi - lo < minSpan) {
    const mid = (lo + hi) / 2
    lo = mid - minSpan / 2
    hi = mid + minSpan / 2
  }
  const step = niceStep(hi - lo)
  const d0 = Math.floor(lo / step) * step
  const d1 = Math.ceil(hi / step) * step
  const ticks = []
  for (let t = d0; t <= d1 + step / 2; t += step) ticks.push(Number(t.toFixed(10)))
  return { domain: [d0, d1], ticks }
}
