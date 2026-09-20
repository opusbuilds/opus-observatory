<script setup lang="ts">
defineProps<{ x: number; y: number; anchor?: 'start' | 'middle' | 'end'; color?: string }>()
</script>

<template>
  <text :x="x" :y="y" :text-anchor="anchor ?? 'start'" font-family="var(--mono)" font-size="11" :fill="color ?? 'var(--faint)'"><slot /></text>
</template>
