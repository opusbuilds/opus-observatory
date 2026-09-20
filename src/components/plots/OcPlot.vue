<script setup lang="ts">
import { computed } from 'vue'
import PlotAxisLabel from './PlotAxisLabel.vue'
import { axes, niceDomain, polyline, type Frame } from '@/lib/scale'
import type { OcSeries } from '@/types/observatory'

const props = defineProps<{ series: OcSeries }>()

const frame: Frame = { w: 760, h: 300, left: 70, right: 30, top: 24, bottom: 44 }
const hollowSpacingPx = 14

const yAxis = computed(() => {
  const values = [
    ...props.series.points.flatMap((p) => [p.ocMin.value - p.ocMin.err, p.ocMin.value + p.ocMin.err]),
    ...props.series.archiveDrift.flatMap((d) => [d.ocMin - d.bandMin, d.ocMin + d.bandMin]),
    -props.series.exoclockBandMin,
    props.series.exoclockBandMin,
  ]
  return niceDomain(Math.min(...values), Math.max(...values), 4)
})

const sc = computed(() => axes(frame, props.series.epochRange, yAxis.value.domain))

const archiveBand = computed(() => {
  const { x, y } = sc.value
  const top = props.series.archiveDrift.map((d) => `${x(d.epoch)},${y(d.ocMin + d.bandMin)}`)
  const bot = props.series.archiveDrift.toReversed().map((d) => `${x(d.epoch)},${y(d.ocMin - d.bandMin)}`)
  return [...top, ...bot].join(' ')
})

const archivePath = computed(() => polyline(props.series.archiveDrift.map((d) => [sc.value.x(d.epoch), sc.value.y(d.ocMin)])))

const epochTicks = computed(() => {
  const [a, b] = props.series.epochRange
  return [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(a + (b - a) * f))
})

const points = computed(() => {
  const hollowSeen = new Map<number, number>()
  return props.series.points.map((p, i) => {
    let dx = 0
    if (p.hollow) {
      const n = (hollowSeen.get(p.epoch) ?? 0) + 1
      hollowSeen.set(p.epoch, n)
      dx = n * hollowSpacingPx
    }
    return {
      key: i,
      hollow: p.hollow,
      cx: sc.value.x(p.epoch) + dx,
      cy: sc.value.y(p.ocMin.value),
      y1: sc.value.y(p.ocMin.value - p.ocMin.err),
      y2: sc.value.y(p.ocMin.value + p.ocMin.err),
    }
  })
})
</script>

<template>
  <svg :viewBox="`0 0 ${frame.w} ${frame.h}`" width="100%" role="img" aria-label="Observed minus calculated mid-time against epoch">
    <template v-for="g in yAxis.ticks" :key="g">
      <line :x1="frame.left" :y1="sc.y(g)" :x2="frame.w - frame.right" :y2="sc.y(g)" :stroke="g === 0 ? 'var(--line2)' : 'var(--line)'" />
      <PlotAxisLabel :x="frame.left - 10" :y="sc.y(g) + 4" anchor="end">{{ g > 0 ? '+' : '' }}{{ g }}</PlotAxisLabel>
    </template>
    <rect
      :x="frame.left"
      :y="sc.y(series.exoclockBandMin)"
      :width="frame.w - frame.left - frame.right"
      :height="sc.y(-series.exoclockBandMin) - sc.y(series.exoclockBandMin)"
      fill="var(--green)"
      opacity="0.13"
    />
    <line :x1="frame.left" :y1="sc.y(0)" :x2="frame.w - frame.right" :y2="sc.y(0)" stroke="var(--green)" stroke-width="1.4" />
    <polygon :points="archiveBand" fill="var(--red)" opacity="0.1" />
    <path :d="archivePath" fill="none" stroke="var(--red)" stroke-width="1.4" stroke-dasharray="5 4" />
    <template v-for="p in points" :key="p.key">
      <line :x1="p.cx" :y1="p.y1" :x2="p.cx" :y2="p.y2" :stroke="p.hollow ? 'var(--muted)' : 'var(--ink)'" :stroke-width="p.hollow ? 1 : 1.4" />
      <circle v-if="p.hollow" :cx="p.cx" :cy="p.cy" r="4.5" fill="var(--card)" stroke="var(--muted)" stroke-width="1.4" />
      <circle v-else :cx="p.cx" :cy="p.cy" r="5" fill="var(--ink)" />
    </template>
    <PlotAxisLabel v-for="t in epochTicks" :key="t" :x="sc.x(t)" :y="frame.h - 16" anchor="middle">{{ t }}</PlotAxisLabel>
    <PlotAxisLabel :x="frame.left" :y="14">O−C, minutes</PlotAxisLabel>
    <PlotAxisLabel :x="frame.w - frame.right" :y="frame.h - 3" anchor="end">epoch</PlotAxisLabel>
  </svg>
</template>
