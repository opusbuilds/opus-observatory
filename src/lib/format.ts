import type { Measurement } from '@/types/observatory'

export function signed(n: number, digits = 2) {
  const abs = Math.abs(n).toFixed(digits)
  if (n < 0) return `−${abs}`
  if (n > 0) return `+${abs}`
  return abs
}

export function plain(n: number, digits = 2) {
  return (n < 0 ? '−' : '') + Math.abs(n).toFixed(digits)
}

export function withBar(m: Measurement, digits = 2, sign = false) {
  const v = sign ? signed(m.value, digits) : plain(m.value, digits)
  return `${v} ± ${plain(m.err, digits)}`
}

export function percent(n: number, digits = 2) {
  return `${plain(n, digits)}%`
}

export function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
