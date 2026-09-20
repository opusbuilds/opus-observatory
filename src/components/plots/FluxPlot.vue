<script setup lang="ts">
import { computed } from 'vue'
import PlotAxisLabel from './PlotAxisLabel.vue'
import { axes, niceDomain, type Frame } from '@/lib/scale'
import type { TriageRecord } from '@/types/observatory'

const props = defineProps<{ triage: TriageRecord }>()

const frame: Frame = { w: 760, h: 210, left: 60, right: 20, top: 18, bottom: 36 }

const yAxis = computed(() => niceDomain(0, Math.max(props.triage.floor, ...props.triage.frames.map((f) => f.targetFlux)) * 1.2))
const sc = computed(() => axes(frame, [0, 1], yAxis.value.domain))

const points = computed(() =>
  props.triage.frames.map((f, i) => ({ cx: sc.value.x(i / (props.triage.frames.length - 1)), cy: sc.value.y(f.targetFlux) })),
)
const seed = computed(() => points.value[props.triage.seedFrame])
</script>

<template>
  <svg :viewBox="`0 0 ${frame.w} ${frame.h}`" width="100%" role="img" aria-label="Target peak counts per frame against the floor">
    <rect :x="sc.x(triage.window.start)" :y="frame.top" :width="sc.x(triage.window.end) - sc.x(triage.window.start)" :height="sc.innerHeight" fill="var(--green)" opacity="0.07" />
    <line :x1="frame.left" :y1="sc.y(triage.floor)" :x2="frame.w - frame.right" :y2="sc.y(triage.floor)" stroke="var(--red)" stroke-width="1.2" stroke-dasharray="5 4" />
    <PlotAxisLabel :x="frame.w - frame.right" :y="sc.y(triage.floor) - 6" anchor="end" color="var(--red)">{{ triage.floor }}-count floor</PlotAxisLabel>
    <template v-for="g in yAxis.ticks" :key="g">
      <line :x1="frame.left" :y1="sc.y(g)" :x2="frame.w - frame.right" :y2="sc.y(g)" stroke="var(--line)" />
      <PlotAxisLabel :x="frame.left - 8" :y="sc.y(g) + 4" anchor="end">{{ g }}</PlotAxisLabel>
    </template>
    <circle v-for="(p, i) in points" :key="i" :cx="p.cx" :cy="p.cy" r="2.4" :fill="i === triage.seedFrame ? 'var(--green)' : 'var(--muted)'" />
    <PlotAxisLabel v-if="seed" :x="seed.cx" :y="seed.cy - 9" anchor="middle" color="var(--green)">seed</PlotAxisLabel>
    <PlotAxisLabel :x="frame.left" :y="12">target peak counts</PlotAxisLabel>
  </svg>
</template>
