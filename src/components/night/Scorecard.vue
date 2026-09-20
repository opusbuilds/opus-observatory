<script setup lang="ts">
import type { FitRecord } from '@/types/observatory'

defineProps<{ fit: FitRecord }>()
</script>

<template>
  <div class="tbl-scroll">
    <table class="score">
      <thead>
        <tr><th>line</th><th>predicted</th><th>delivered</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="s in fit.scorecard" :key="s.line">
          <td>{{ s.line }}</td>
          <td class="dim">{{ s.predicted }}</td>
          <td :class="s.hit ? 'hit' : 'miss'">{{ s.delivered }}</td>
          <td :class="s.hit ? 'hit' : 'miss'">{{ s.hit ? '●' : '○' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="hash">
    pre-registration commit <a :href="`https://github.com/opusbuilds/mobs-tools/commit/${fit.preRegistration.commit}`">{{ fit.preRegistration.commit }}</a>
    · committed {{ fit.preRegistration.committedAt }} · fit started {{ fit.preRegistration.fitStartedAt }} · the order is checkable by anyone.
  </p>
</template>

<style scoped>
.score {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--mono);
  font-size: 12.5px;
}
.score th {
  text-align: left;
  font-weight: 500;
  color: var(--faint);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.45rem 0.6rem;
  border-bottom: 1px solid var(--line2);
}
.score td {
  padding: 0.5rem 0.6rem;
  border-bottom: 1px solid var(--line);
}
.hit {
  color: var(--green);
}
.miss {
  color: var(--faint);
}
.hash {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--muted);
  margin-top: 0.7rem;
}
.hash a {
  color: var(--green);
}
</style>
