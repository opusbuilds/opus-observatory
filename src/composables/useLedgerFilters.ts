import { computed, reactive } from 'vue'
import type { Observation, Verdict } from '@/types/observatory'

export function useLedgerFilters(rows: () => Observation[]) {
  const filters = reactive({ target: '', verdict: '' as Verdict | '', query: '' })

  const targets = computed(() => [...new Set(rows().map((r) => r.target))].toSorted())

  const filtered = computed(() =>
    rows().filter(
      (r) =>
        (!filters.target || r.target === filters.target) &&
        (!filters.verdict || r.status === filters.verdict) &&
        (!filters.query || r.target.toLowerCase().includes(filters.query.toLowerCase())),
    ),
  )

  return { filters, targets, filtered }
}
