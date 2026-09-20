<script setup lang="ts">
import GoLink from '@/components/ui/GoLink.vue'
import VerdictTag from '@/components/ui/VerdictTag.vue'
import { percent, withBar } from '@/lib/format'
import type { Observation } from '@/types/observatory'

defineProps<{ rows: Observation[] }>()
</script>

<template>
  <div class="tbl-scroll">
    <table class="ledger">
      <thead>
        <tr><th>date</th><th>verdict</th><th class="num">O−C (min)</th><th class="num">scatter</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.id">
          <td class="dim">{{ r.obsDate }}</td>
          <td><VerdictTag :row="r" /></td>
          <td class="num">{{ r.ocMin ? withBar(r.ocMin, 2, true) : '—' }}</td>
          <td class="num">{{ r.scatterPct !== null ? percent(r.scatterPct) : '—' }}</td>
          <td><GoLink :to="{ name: 'night', params: { id: r.id } }">night</GoLink></td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="5" class="dim">rows beyond this mockup's sample</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
