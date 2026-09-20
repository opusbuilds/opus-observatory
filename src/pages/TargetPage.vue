<script setup lang="ts">
import { computed } from 'vue'
import { api } from '@/api/observatory'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'
import OcPlot from '@/components/plots/OcPlot.vue'
import PlotFrame from '@/components/plots/PlotFrame.vue'
import PlotLegend from '@/components/plots/PlotLegend.vue'
import TargetRows from '@/components/target/TargetRows.vue'
import Aside from '@/components/ui/Aside.vue'
import KeyValue from '@/components/ui/KeyValue.vue'
import type { Ephemeris } from '@/types/observatory'

const props = defineProps<{ slug: string }>()

const target = computed(() => api.target(props.slug))
const rows = computed(() => (target.value ? api.observationsFor(target.value.name) : []))
const fitted = computed(() => rows.value.filter((r) => r.status !== 'rejected').length)
const floorNights = computed(() => rows.value.filter((r) => r.reason === 'floor').length)
const oc = computed(() => (target.value ? api.ocSeries(target.value.name) : null))

const ephemeris = (e: Ephemeris) => `T0 ${e.t0.toFixed(4)} BJD, P ${e.period.toFixed(7)} d · ${e.source}, fetched ${e.fetched}`

const legend = [
  { label: 'this instrument', kind: 'dot', color: 'var(--ink)' },
  { label: 'other observers, same frames', kind: 'hollow', color: 'var(--muted)' },
  { label: 'ExoClock ephemeris', kind: 'line', color: 'var(--green)' },
  { label: 'archive prior, propagated', kind: 'line', color: 'var(--red)' },
] as const
</script>

<template>
  <template v-if="target">
    <Breadcrumb :trail="[{ label: 'targets', to: '/targets' }, { label: target.name }]" />
    <h1>{{ target.name }}</h1>
    <p class="lede">
      V {{ target.vmag }} · P {{ target.periodDays.toFixed(5) }} d · {{ rows.length }} nights opened, {{ fitted }} fitted.
      <template v-if="target.note"> {{ target.note }}</template>
    </p>
    <Aside v-if="target.faint">
      {{ api.faintSentence() }} {{ floorNights }} of {{ rows.length }} nights rejected on the 200-count floor (V {{ target.vmag }} against the floor at this instrument's scale).
    </Aside>

    <h2>O−C</h2>
    <template v-if="oc">
      <PlotFrame>
        <OcPlot :series="oc" />
        <template #caption>
          Observed minus calculated mid-time against epoch. The green line is ExoClock's verified ephemeris with its band; the dashed red line is the archive prior propagated forward with its widening band, 5.6 minutes stale by row 52. The filled point is this instrument's; hollow points are other observers' reductions of the same frames.
        </template>
      </PlotFrame>
      <PlotLegend :items="[...legend]" />
      <Aside>
        The plot makes the two findings visible at once: the archive prior drifts, and this instrument's point sits where the good clock says it should, a third of a sigma against an ephemeris already good to 47 seconds. It adds nothing to that clock, and it is shown so that a point that adds nothing is seen to add nothing.
      </Aside>
    </template>
    <PlotFrame v-else>
      <p class="faintline empty">No timing points pass on this target yet. The panel appears with the first PASS row.</p>
    </PlotFrame>

    <h2>Parameters &amp; provenance</h2>
    <KeyValue
      :items="[
        { k: 'archive', v: ephemeris(target.archive) },
        { k: 'exoclock', v: ephemeris(target.exoclock) },
        { k: 'derived', v: target.derived },
      ]"
    />

    <h2>Rows</h2>
    <TargetRows :rows="rows" />
  </template>
  <template v-else>
    <h1>Unknown target</h1>
    <p class="lede">No planet by that name has been opened.</p>
  </template>
</template>

<style scoped>
.empty {
  margin: 1rem 0;
  text-align: center;
}
</style>
