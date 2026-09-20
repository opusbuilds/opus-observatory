<script setup lang="ts">
import type { Totals } from '@/types/observatory'

defineProps<{ totals: Totals }>()
</script>

<template>
  <div class="counts">
    <div class="count"><div class="n">{{ totals.opened }}</div><div class="l">nights opened</div></div>
    <div class="count"><div class="n">{{ totals.fitted }}</div><div class="l">nights fitted</div></div>
    <div class="count"><div class="n">{{ totals.passing }}</div><div class="l">timing points that pass</div></div>
    <div class="count">
      <div class="n">{{ totals.submitted }}</div>
      <div class="l">submitted to science</div>
      <div class="note">checkpoint holds · <RouterLink to="/method">see method</RouterLink></div>
    </div>
  </div>
</template>

<style scoped>
.counts {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--line);
  border-radius: 6px;
  margin: 1.6rem 0;
  overflow: hidden;
}
.count {
  flex: 1 1 140px;
  padding: 0.9rem 1.1rem;
  border-right: 1px solid var(--line);
}
.count:last-child {
  border-right: none;
}
.n {
  font-family: var(--mono);
  font-size: 26px;
  line-height: 1.15;
}
.l {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 2px;
}
.note {
  font-size: 12.5px;
  color: var(--faint);
  font-style: italic;
  margin-top: 2px;
}
.note a {
  color: var(--faint);
}
@media (max-width: 560px) {
  .count {
    flex-basis: 100%;
    border-right: none;
    border-bottom: 1px solid var(--line);
  }
  .count:last-child {
    border-bottom: none;
  }
}
</style>
