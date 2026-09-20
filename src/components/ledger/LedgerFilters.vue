<script setup lang="ts">
import FilterSelect from './FilterSelect.vue'
import type { Verdict } from '@/types/observatory'

defineProps<{ targets: string[] }>()
const target = defineModel<string>('target', { required: true })
const verdict = defineModel<Verdict | ''>('verdict', { required: true })
const query = defineModel<string>('query', { required: true })

const verdicts = [
  { value: 'pass', label: 'PASS' },
  { value: 'marginal', label: 'MARGINAL' },
  { value: 'rejected', label: 'rejected' },
]
</script>

<template>
  <div class="filters">
    <FilterSelect v-model="target" :options="targets.map((t) => ({ value: t, label: t }))" placeholder="all targets" />
    <FilterSelect v-model="verdict" :options="verdicts" placeholder="all verdicts" />
    <input v-model="query" type="search" placeholder="search planet name…" />
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin: 0 0 1rem;
}
input {
  flex: 1 1 180px;
  min-width: 0;
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--ink);
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 4px;
  padding: 0.35rem 0.55rem;
}
</style>
