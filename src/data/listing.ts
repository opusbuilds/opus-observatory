import type { Candidate, ListingNight } from '@/types/observatory'

export const listing: ListingNight[] = [
  {
    date: '2026-09-19',
    entries: [
      { target: 'HAT-P-32 b', geometry: 'full · 22:10–01:05 UT · V 11.4 · depth 22 mmag', observationId: 'n54', notOpened: null },
      { target: 'Qatar-1 b', geometry: 'full · 21:40–23:20 UT · V 12.8 · depth 21 mmag', observationId: 'n53', notOpened: null },
      { target: 'TrES-3 b', geometry: 'full · 23:05–00:25 UT · V 12.4 · depth 27 mmag', observationId: 'n52b', notOpened: null },
      { target: 'WASP-48 b', geometry: 'partial, egress-only', observationId: null, notOpened: 'geometry' },
    ],
  },
  {
    date: '2026-09-12',
    entries: [
      { target: 'WASP-67 b', geometry: 'full · 21:18–23:12 UT · V 12.5 · depth 15 mmag', observationId: 'n52', notOpened: null },
      { target: 'KELT-16 b', geometry: 'under floor by magnitude before download', observationId: null, notOpened: 'floor' },
    ],
  },
  {
    date: '2026-09-10',
    entries: [
      { target: 'WASP-52 b', geometry: 'full · 20:55–22:41 UT · V 12.0 · depth 27 mmag', observationId: 'n51', notOpened: null },
    ],
  },
  {
    date: '2026-09-08',
    entries: [
      { target: 'KELT-16 b', geometry: 'full · 22:30–00:48 UT · V 11.7 · depth 11 mmag', observationId: 'n50', notOpened: null },
      { target: 'HAT-P-32 b', geometry: 'partial, egress-only', observationId: null, notOpened: 'geometry' },
    ],
  },
]

export const candidates: Candidate[] = [
  { target: 'WASP-52 b', geometry: 'tonight · full · 20:41–22:28 UT · ephemeris bar ±0.8 min', launchable: true },
  { target: 'Qatar-1 b', geometry: 'tonight · full · 23:02–00:44 UT · ephemeris bar ±1.1 min', launchable: true },
  { target: 'KELT-16 b', geometry: 'tonight · partial, egress-only', launchable: false },
]
