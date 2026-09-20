<script setup lang="ts">
import { percent, withBar } from '@/lib/format'
import type { CrossCheck } from '@/types/observatory'

defineProps<{ checks: CrossCheck[] }>()
</script>

<template>
  <div class="tbl-scroll">
    <table class="ledger">
      <thead>
        <tr><th>source</th><th class="num">mid-time O−C (min)</th><th class="num">depth</th><th class="num">scatter</th><th>note</th></tr>
      </thead>
      <tbody>
        <tr v-for="c in checks" :key="c.source">
          <td>{{ c.source }}</td>
          <td class="num">{{ c.ocMin ? withBar(c.ocMin, 2, true) : '—' }}</td>
          <td class="num">{{ c.depth != null ? c.depth.toFixed(4) : '—' }}</td>
          <td class="num">{{ c.scatterPct != null ? percent(c.scatterPct) : '—' }}</td>
          <td class="dim">{{ c.note }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
