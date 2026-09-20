<script setup lang="ts">
import { computed } from 'vue'
import { api } from '@/api/observatory'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'
import CrossCheckTable from '@/components/night/CrossCheckTable.vue'
import Scorecard from '@/components/night/Scorecard.vue'
import VerdictClauses from '@/components/night/VerdictClauses.vue'
import CloudPlot from '@/components/plots/CloudPlot.vue'
import FluxPlot from '@/components/plots/FluxPlot.vue'
import LightCurvePlot from '@/components/plots/LightCurvePlot.vue'
import PlotFrame from '@/components/plots/PlotFrame.vue'
import Aside from '@/components/ui/Aside.vue'
import CardRow from '@/components/ui/CardRow.vue'
import MiniCard from '@/components/ui/MiniCard.vue'
import VerdictTag from '@/components/ui/VerdictTag.vue'
import { percent, slugify, withBar } from '@/lib/format'

const props = defineProps<{ id: string }>()

const row = computed(() => api.observation(props.id))
const triage = computed(() => api.triage(props.id))
const fit = computed(() => api.fit(props.id))
const checks = computed(() => api.crossChecks(props.id))

const cloudy = computed(() => row.value?.reason === 'cloud')
const inWindow = computed(() => {
  const t = triage.value
  if (!t) return 0
  return t.frames.filter((_, i) => {
    const f = i / (t.frames.length - 1)
    return f > t.window.start && f < t.window.end
  }).length
})
const ratios = computed(() => {
  const c = triage.value?.comparisons ?? []
  if (!c.length) return ''
  return `${Math.min(...c.map((x) => x.ratio))}×–${Math.max(...c.map((x) => x.ratio))}× target`
})
</script>

<template>
  <template v-if="row && triage">
    <Breadcrumb :trail="[{ label: 'ledger', to: '/' }, { label: row.target, to: { name: 'target', params: { slug: slugify(row.target) } } }, { label: row.obsDate }]" />
    <h1>{{ row.target }} · {{ row.obsDate }}</h1>
    <p class="lede"><VerdictTag :row="row" />&nbsp;&nbsp;{{ row.note }}</p>

    <h2>Triage evidence</h2>
    <PlotFrame>
      <CloudPlot :triage="triage" />
      <template #caption>
        Stars detected per frame through the night, transit window shaded.
        {{ cloudy ? 'A rejected night usually explains itself here.' : 'Steady star counts: the sky held.' }}
      </template>
    </PlotFrame>
    <PlotFrame>
      <FluxPlot :triage="triage" />
      <template #caption>The target's peak counts frame by frame, against the {{ triage.floor }}-count floor. Seed frame marked.</template>
    </PlotFrame>
    <CardRow>
      <MiniCard
        title="comparison box"
        :value="triage.comparisons.length ? `${triage.comparisons.length} comparisons` : 'n/a'"
        :sub="triage.comparisons.length ? `brightness ratios ${ratios}; drift ${triage.driftPx} px over the night` : 'floor fired before selection'"
      />
      <MiniCard title="frames" :value="String(triage.frames.length)" :sub="`${inWindow} in window`" />
      <MiniCard title="pointing drift" :value="`${triage.driftPx} px`" sub="track drawn on the reference frame" />
    </CardRow>
    <h3>Verdict block · the tool's own words</h3>
    <VerdictClauses :triage="triage" />

    <template v-if="fit && row.ocMin && row.depth && row.scatterPct !== null">
      <h2>Fit</h2>
      <PlotFrame>
        <LightCurvePlot :fit="fit" :scatter-pct="row.scatterPct" />
        <template #caption>Detrended light curve with the fitted model. Grey points, one red model line.</template>
      </PlotFrame>
      <CardRow>
        <MiniCard title="mid-time O−C" :value="`${withBar(row.ocMin, 2, true)} min`" sub="against ExoClock's ephemeris" />
        <MiniCard title="depth R²ₚ/R²★" :value="withBar(row.depth, 4)" :sub="`scatter ${percent(row.scatterPct)}`" />
        <MiniCard
          title="bar provenance"
          :value="fit.barProvenance"
          :tone="fit.barProvenance === 'posterior' ? 'green' : undefined"
          :sub="fit.barProvenance === 'posterior' ? 'post-run check: printed bar came from the posterior, not the replacing estimator' : 'post-run check: printed bar came from the replacing estimator'"
        />
        <MiniCard title="QC / KTMF" :value="`${fit.qc} · ${fit.ktmf.toFixed(2)}`" sub="quality gate and KTMF score" />
      </CardRow>

      <h2>Pre-registration · predicted vs delivered</h2>
      <Scorecard :fit="fit" />

      <template v-if="checks.length">
        <h2>Cross-check · same frames, other hands</h2>
        <CrossCheckTable :checks="checks" />
        <Aside>
          Reductions of the same frames, side by side. Names are not shown; the point is the spread, not who produced it. One observer has asked to be excluded and is never looked at, so never appears.
        </Aside>
      </template>
    </template>
  </template>
  <template v-else>
    <h1>Unknown night</h1>
    <p class="lede">No row in the ledger carries that id.</p>
  </template>
</template>
