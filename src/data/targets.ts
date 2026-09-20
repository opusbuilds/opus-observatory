import { slugify } from '@/lib/format'
import type { Ephemeris, Target } from '@/types/observatory'

const derived = 'transit duration and depth prior derived from archive a/R★ and R_p/R★; derivation noted per row'

function archive(t0: number, period: number, fetched: string): Ephemeris {
  return { t0, period, t0Err: 0.0008, periodErr: 0.0000012, source: 'NASA Exoplanet Archive', fetched }
}

function exoclock(t0: number, period: number, fetched: string): Ephemeris {
  return { t0, period, t0Err: 0.0002, periodErr: 0.0000002, source: 'ExoClock verified', fetched }
}

function target(name: string, vmag: number, periodDays: number, a: Ephemeris, e: Ephemeris, note: string | null, faint = false): Target {
  return { name, slug: slugify(name), vmag, periodDays, archive: a, exoclock: e, derived, note, faint }
}

export const targets: Target[] = [
  target('WASP-67 b', 12.5, 4.61442,
    archive(2455824.3742, 4.614421, '2026-09-11'), exoclock(2459423.8811, 4.6144219, '2026-09-11'),
    'Bright enough for this instrument with margin. The one target so far with a timing point that agrees with the best available clock.'),
  target('TrES-3 b', 12.4, 1.30619,
    archive(2454185.9101, 1.3061865, '2026-09-02'), exoclock(2459400.1120, 1.3061864, '2026-09-02'),
    'Deep and frequent; a forgiving target whose ephemeris needs nothing from this instrument. Useful for calibration, not for the clock.'),
  target('WASP-52 b', 12.0, 1.74978,
    archive(2455793.6810, 1.7497798, '2026-08-21'), exoclock(2459410.5532, 1.7497801, '2026-08-21'),
    'The cross-check target: three observers, same frames, four minutes of agreement on time and a factor of four of disagreement on depth.'),
  target('HAT-P-32 b', 11.4, 2.15001,
    archive(2454420.4463, 2.1500082, '2026-09-19'), exoclock(2459430.2201, 2.1500080, '2026-09-19'),
    null, true),
  target('Qatar-1 b', 12.8, 1.42003,
    archive(2455518.4102, 1.4200242, '2026-08-28'), exoclock(2459412.7743, 1.4200240, '2026-08-28'),
    'Marginal for the floor on poor nights; usable on the best ones.'),
  target('KELT-16 b', 11.7, 0.96899,
    archive(2457247.2479, 0.9689951, '2026-09-08'), exoclock(2459420.9012, 0.9689949, '2026-09-08'),
    'Short period, frequent transits, orbital-decay candidate. The target the O−C panel exists for, once there are more clean nights.'),
  target('WASP-12 b', 11.7, 1.09142,
    archive(2456176.6683, 1.0914203, '2026-08-30'), exoclock(2459425.3388, 1.0914201, '2026-08-30'),
    'The famous decaying orbit. Every clean point on this target is worth something; none of the six nights so far were clean.'),
]

export const faintSentence =
  'This star is too faint for this telescope to time. The nights are recorded so the pattern is visible, not because they will ever yield a point.'
