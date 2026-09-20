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
