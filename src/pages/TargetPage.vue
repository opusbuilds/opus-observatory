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
const oc = computed(() => (target.value ? api.ocSeries(target.value.name) : null))

const ephemeris = (e: Ephemeris | null) =>
  e && e.t0 !== null && e.period !== null ? `T0 ${e.t0.toFixed(4)} BJD, P ${e.period.toFixed(7)} d · ${e.source}, fetched ${e.fetched ?? 'n/a'}` : 'not checked against ExoClock yet'

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
      V {{ target.vmag ?? '?' }} · P {{ target.periodDays?.toFixed(5) ?? '?' }} d · {{ target.opened }} nights opened, {{ target.fitted }} fitted.
      <template v-if="target.note"> {{ target.note }}</template>
    </p>
    <Aside v-if="target.faint">
      {{ api.faintSentence() }} {{ target.floorNights }} of {{ target.opened }} nights rejected on the 200-count floor (V {{ target.vmag }} against the floor at this instrument's scale).
    </Aside>

    <h2>O−C</h2>
    <template v-if="oc">
      <PlotFrame>
        <OcPlot :series="oc" />
        <template #caption>
          Observed minus calculated mid-time against epoch. Where ExoClock has a verified ephemeris it is the green zero line with its band and the dashed red line is the archive prior propagated forward with its widening band; where it does not, the archive ephemeris is the zero line. Filled points are this instrument's; hollow points, when published, are other observers' reductions of the same frames.
        </template>
      </PlotFrame>
      <PlotLegend :items="[...legend]" />
      <Aside>
        A point is shown against the best available clock beside that clock's own bar, so a point that adds nothing to it is seen to add nothing. Where the archive prior has drifted from the verified ephemeris, the red band shows by how much.
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
