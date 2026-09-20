<script setup lang="ts">
defineProps<{ items: { label: string; kind: 'dot' | 'hollow' | 'line'; color: string }[] }>()
</script>

<template>
  <div class="leg">
    <span v-for="it in items" :key="it.label">
      <span class="sw" :class="it.kind" :style="{ '--c': it.color }"></span>{{ it.label }}
    </span>
  </div>
</template>

<style scoped>
.leg {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--muted);
  margin: 0.4rem 0 0;
}
.leg > span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.sw {
  width: 11px;
  height: 11px;
  display: inline-block;
}
.dot {
  border-radius: 50%;
  background: var(--c);
}
.hollow {
  border-radius: 50%;
  background: var(--card);
  border: 1.5px solid var(--c);
}
.line {
  height: 3px;
  border-radius: 1px;
  background: var(--c);
}
</style>
