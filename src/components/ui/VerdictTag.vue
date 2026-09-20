<script setup lang="ts">
import type { Observation } from '@/types/observatory'

defineProps<{ row: Pick<Observation, 'status' | 'reason'> }>()
</script>

<template>
  <span class="tag" :class="row.status">
    <template v-if="row.status === 'pass'">PASS</template>
    <template v-else-if="row.status === 'marginal'">MARGINAL</template>
    <template v-else>rejected · {{ row.reason }}</template>
  </span>
</template>

<style scoped>
.tag {
  display: inline-block;
  font-family: var(--mono);
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 3px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.pass {
  color: var(--green);
  background: var(--green-soft);
}
.marginal {
  color: var(--amber);
  background: var(--amber-soft);
}
.rejected {
  color: var(--rej-ink);
  background: var(--rej);
}
</style>
