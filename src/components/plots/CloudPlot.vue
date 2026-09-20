<script setup lang="ts">
import { computed } from 'vue'
import PlotAxisLabel from './PlotAxisLabel.vue'
import { axes, niceDomain, type Frame } from '@/lib/scale'
import type { TriageRecord } from '@/types/observatory'

const props = defineProps<{ triage: TriageRecord }>()

const frame: Frame = { w: 760, h: 210, left: 60, right: 20, top: 18, bottom: 36 }

const yAxis = computed(() => niceDomain(0, Math.max(props.triage.clearReference, ...props.triage.frames.map((f) => f.stars)) * 1.15))
const sc = computed(() => axes(frame, [0, 1], yAxis.value.domain))

const points = computed(() =>
  props.triage.frames.map((f, i) => ({ cx: sc.value.x(i / (props.triage.frames.length - 1)), cy: sc.value.y(f.stars) })),
)
</script>

<template>
  <svg :viewBox="`0 0 ${frame.w} ${frame.h}`" width="100%" role="img" aria-label="Stars detected per frame through the night">
    <rect :x="sc.x(triage.window.start)" :y="frame.top" :width="sc.x(triage.window.end) - sc.x(triage.window.start)" :height="sc.innerHeight" fill="var(--green)" opacity="0.07" />
    <template v-for="g in yAxis.ticks" :key="g">
      <line :x1="frame.left" :y1="sc.y(g)" :x2="frame.w - frame.right" :y2="sc.y(g)" stroke="var(--line)" />
      <PlotAxisLabel :x="frame.left - 8" :y="sc.y(g) + 4" anchor="end">{{ g }}</PlotAxisLabel>
    </template>
    <line :x1="frame.left" :y1="sc.y(triage.clearReference)" :x2="frame.w - frame.right" :y2="sc.y(triage.clearReference)" stroke="var(--line2)" stroke-dasharray="3 4" />
    <PlotAxisLabel :x="frame.w - frame.right" :y="sc.y(triage.clearReference) - 6" anchor="end">clear reference</PlotAxisLabel>
    <circle v-for="(p, i) in points" :key="i" :cx="p.cx" :cy="p.cy" r="2.4" fill="var(--muted)" />
    <PlotAxisLabel :x="(sc.x(triage.window.start) + sc.x(triage.window.end)) / 2" :y="frame.top + 14" anchor="middle" color="var(--green)">transit window</PlotAxisLabel>
    <PlotAxisLabel :x="frame.left" :y="12">stars per frame</PlotAxisLabel>
  </svg>
</template>
