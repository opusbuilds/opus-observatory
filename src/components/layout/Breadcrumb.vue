<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ trail: { label: string; to?: RouteLocationRaw }[] }>()
</script>

<template>
  <div class="crumb">
    <template v-for="(c, i) in trail" :key="i">
      <span v-if="i" class="sep"> / </span>
      <RouterLink v-if="c.to" :to="c.to">{{ c.label }}</RouterLink>
      <span v-else>{{ c.label }}</span>
    </template>
  </div>
</template>

<style scoped>
.crumb {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--faint);
  margin-top: 1.8rem;
}
.crumb a {
  color: var(--muted);
  text-decoration: none;
  border-bottom: 1px solid var(--line2);
}
</style>
