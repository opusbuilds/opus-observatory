<script setup lang="ts">
import { computed } from 'vue'
import PlotAxisLabel from './PlotAxisLabel.vue'
import { axes, polyline, type Frame } from '@/lib/scale'
import { transitFlux } from '@/lib/transit'
import type { FitRecord } from '@/types/observatory'

const props = defineProps<{ fit: FitRecord; scatterPct: number }>()

const frame: Frame = { w: 760, h: 230, left: 64, right: 20, top: 18, bottom: 36 }
const gridlines = [0.98, 0.99, 1.0]

const sc = computed(() => {
  const s = props.scatterPct / 100
  return axes(frame, [0, 1], [1 - props.fit.model.depth - 3.5 * s, 1 + 3.5 * s])
})

const points = computed(() => props.fit.lightCurve.map((p) => ({ cx: sc.value.x(p.phase), cy: sc.value.y(p.flux) })))

const modelPath = computed(() =>
  props.fit.modelCurve?.length
    ? polyline(props.fit.modelCurve.map((p) => [sc.value.x(p.phase), sc.value.y(p.flux)]))
    : polyline(Array.from({ length: 121 }, (_, i) => [sc.value.x(i / 120), sc.value.y(transitFlux(i / 120, props.fit.model))])),
)
</script>

<template>
  <svg :viewBox="`0 0 ${frame.w} ${frame.h}`" width="100%" role="img" aria-label="Detrended light curve with fitted model">
    <template v-for="g in gridlines" :key="g">
      <line :x1="frame.left" :y1="sc.y(g)" :x2="frame.w - frame.right" :y2="sc.y(g)" stroke="var(--line)" />
      <PlotAxisLabel :x="frame.left - 8" :y="sc.y(g) + 4" anchor="end">{{ g.toFixed(2) }}</PlotAxisLabel>
    </template>
    <circle v-for="(p, i) in points" :key="i" :cx="p.cx" :cy="p.cy" r="2.6" fill="var(--muted)" />
    <path :d="modelPath" fill="none" stroke="var(--red)" stroke-width="1.6" />
    <PlotAxisLabel :x="frame.left" :y="12">relative flux</PlotAxisLabel>
  </svg>
</template>
