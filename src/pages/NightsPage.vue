<script setup lang="ts">
import { api } from '@/api/observatory'
import GoLink from '@/components/ui/GoLink.vue'

const listing = api.listing()
</script>

<template>
  <h1>Nights</h1>
  <p class="lede">The listing, night by night, as the scan sees it: which targets had a transit in the window, and what became of each. This is the page that shows how much sky there is and how little of it is usable.</p>
  <div v-for="n in listing" :key="n.date" class="calnight">
    <div class="head">{{ n.date }}</div>
    <div v-for="e in n.entries" :key="e.target" class="row">
      <span class="tgt">{{ e.target }}</span>
      <span class="g">{{ e.geometry }}<template v-if="e.notOpened"> · not opened, {{ e.notOpened }}</template></span>
      <GoLink v-if="e.observationId" :to="{ name: 'night', params: { id: e.observationId } }">night page</GoLink>
      <span v-else class="dim">not opened</span>
    </div>
  </div>
  <p class="faintline">four nights of the listing shown; the real page scrolls the season.</p>
</template>

<style scoped>
.calnight {
  border: 1px solid var(--line);
  border-radius: 6px;
  margin: 1rem 0;
  overflow: hidden;
}
.head {
  font-family: var(--mono);
  font-size: 12.5px;
  padding: 0.6rem 1rem;
  background: var(--card);
  border-bottom: 1px solid var(--line);
  color: var(--muted);
}
.row {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  align-items: baseline;
  padding: 0.55rem 1rem;
  border-bottom: 1px solid var(--line);
  font-family: var(--mono);
  font-size: 12.5px;
}
.row:last-child {
  border-bottom: none;
}
.tgt {
  min-width: 110px;
}
.g {
  color: var(--muted);
  flex: 1;
}
</style>
