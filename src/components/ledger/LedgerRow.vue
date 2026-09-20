<script setup lang="ts">
import { ref } from 'vue'
import GoLink from '@/components/ui/GoLink.vue'
import KeyValue from '@/components/ui/KeyValue.vue'
import VerdictTag from '@/components/ui/VerdictTag.vue'
import { percent, slugify, withBar } from '@/lib/format'
import type { Observation } from '@/types/observatory'

const props = defineProps<{ row: Observation }>()
const open = ref(false)
const detailId = `ledger-detail-${props.row.id}`
</script>

<template>
  <tr class="clickable" @click="open = !open">
    <td>
      <button type="button" class="toggle" :aria-expanded="open" :aria-controls="detailId" @click.stop="open = !open">{{ row.obsDate }}</button>
    </td>
    <td>{{ row.target }}</td>
    <td><VerdictTag :row="row" /></td>
    <td class="num"><template v-if="row.ocMin">{{ withBar(row.ocMin, 2, true) }}</template><span v-else class="dim">—</span></td>
    <td class="num"><template v-if="row.depth">{{ withBar(row.depth, 4) }}</template><span v-else class="dim">—</span></td>
    <td class="num"><template v-if="row.scatterPct !== null">{{ percent(row.scatterPct) }}</template><span v-else class="dim">—</span></td>
  </tr>
  <tr v-if="open" :id="detailId" class="expand">
    <td colspan="6">
      <div class="note">{{ row.note }}</div>
      <KeyValue
        :items="[
          { k: 'dataset', v: row.dataset },
          { k: 'frames', v: `${row.frames} FITS · ${row.manifest}` },
          { k: 'obscode', v: row.obscode ?? '— (nothing submitted)' },
        ]"
      />
      <div class="links">
        <GoLink :to="{ name: 'night', params: { id: row.id } }">open the night page</GoLink>
        <GoLink :to="{ name: 'target', params: { slug: slugify(row.target) } }">target page</GoLink>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.toggle {
  font: inherit;
  color: var(--faint);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.toggle:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}
.expand {
  background: var(--card);
}
.expand td {
  padding: 1rem 1.2rem;
}
.note {
  font-family: var(--serif);
  font-size: 14.5px;
  max-width: 64ch;
  color: var(--muted);
}
.links {
  display: flex;
  gap: 1.2rem;
}
</style>
