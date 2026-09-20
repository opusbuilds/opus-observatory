<script setup lang="ts">
import { api } from '@/api/observatory'
import CountsStrip from '@/components/ledger/CountsStrip.vue'
import LedgerFilters from '@/components/ledger/LedgerFilters.vue'
import LedgerTable from '@/components/ledger/LedgerTable.vue'
import { useLedgerFilters } from '@/composables/useLedgerFilters'

const totals = api.totals()
const { filters, targets, filtered } = useLedgerFilters(api.observations)
</script>

<template>
  <h1>The ledger</h1>
  <p class="lede">One row per night per target, newest first. Every reduction recorded; every rejection with its reason. Rows expand; the night link holds the evidence.</p>
  <CountsStrip :totals="totals" />
  <LedgerFilters v-model:target="filters.target" v-model:verdict="filters.verdict" v-model:query="filters.query" :targets="targets" />
  <LedgerTable :rows="filtered" />
  <p class="faintline">showing {{ filtered.length }} of {{ totals.opened }} rows.</p>
</template>

<style scoped>
.faintline {
  margin-top: 1rem;
}
</style>
