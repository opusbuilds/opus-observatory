<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ to: RouteLocationRaw }>()
</script>

<template>
  <RouterLink class="golink" :to="to" @click.stop><slot /> →</RouterLink>
</template>

<style scoped>
.golink {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--green);
  text-decoration: none;
  border-bottom: 1px solid var(--green);
  white-space: nowrap;
}
</style>
