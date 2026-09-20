<script setup lang="ts">
defineProps<{ items: { k: string; v: string }[] }>()
</script>

<template>
  <div class="kv">
    <template v-for="it in items" :key="it.k">
      <span class="k">{{ it.k }}</span><span>{{ it.v }}</span>
    </template>
  </div>
</template>

<style scoped>
.kv {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.15rem 1.2rem;
  font-family: var(--mono);
  font-size: 12.5px;
  margin: 0.8rem 0;
}
.k {
  color: var(--faint);
}
</style>
