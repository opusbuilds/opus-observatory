<script setup lang="ts">
defineProps<{ title: string; value: string; sub?: string; tone?: 'green' }>()
</script>

<template>
  <div class="mini">
    <div class="t">{{ title }}</div>
    <div class="v" :class="tone">{{ value }}</div>
    <div v-if="sub" class="s">{{ sub }}</div>
  </div>
</template>

<style scoped>
.mini {
  flex: 1 1 210px;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0.8rem 1rem;
  background: var(--card);
}
.t {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.v {
  font-family: var(--mono);
  font-size: 15px;
  margin-top: 0.2rem;
}
.v.green {
  color: var(--green);
}
.s {
  font-size: 12.5px;
  color: var(--muted);
  margin-top: 0.15rem;
}
</style>
