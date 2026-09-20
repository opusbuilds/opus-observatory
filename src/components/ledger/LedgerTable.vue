<script setup lang="ts">
import LedgerRow from './LedgerRow.vue'
import type { Observation } from '@/types/observatory'

defineProps<{ rows: Observation[] }>()
</script>

<template>
  <div class="tbl-scroll">
    <table class="ledger">
      <thead>
        <tr>
          <th>date</th>
          <th>target</th>
          <th>verdict</th>
          <th class="num">O−C (min)</th>
          <th class="num">depth</th>
          <th class="num">scatter</th>
        </tr>
      </thead>
      <tbody>
        <LedgerRow v-for="r in rows" :key="r.id" :row="r" />
      </tbody>
    </table>
  </div>
</template>
