<script setup lang="ts">
import type { TriageRecord } from '@/types/observatory'

defineProps<{ triage: TriageRecord }>()
</script>

<template>
  <div class="clauses">
    <div v-for="c in triage.clauses" :key="c.name">
      <span :class="c.fired ? 'fired' : 'ok'">{{ c.name }}</span>: {{ c.text }}
    </div>
    <div>VERDICT: <span :class="triage.verdict === 'PROCEED' ? 'ok' : 'fired'">{{ triage.verdict }}</span><template v-if="triage.verdict === 'PROCEED'"> · pre-registration scaffold written.</template></div>
  </div>
</template>

<style scoped>
.clauses {
  font-family: var(--mono);
  font-size: 12.5px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0.9rem 1.1rem;
  line-height: 1.75;
}
.fired {
  color: var(--red);
}
.ok {
  color: var(--green);
}
</style>
