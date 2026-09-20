<script setup lang="ts">
import { ref } from 'vue'
import GoLink from '@/components/ui/GoLink.vue'
import KeyValue from '@/components/ui/KeyValue.vue'
import VerdictTag from '@/components/ui/VerdictTag.vue'
import { percent, slugify, withBar } from '@/lib/format'
import type { Observation } from '@/types/observatory'

defineProps<{ row: Observation; frames: number }>()
const open = ref(false)
</script>

<template>
  <tr class="r" :aria-expanded="open" @click="open = !open">
    <td class="dim">{{ row.obsDate }}</td>
    <td>{{ row.target }}</td>
    <td><VerdictTag :row="row" /></td>
    <td class="num"><template v-if="row.ocMin">{{ withBar(row.ocMin, 2, true) }}</template><span v-else class="dim">—</span></td>
    <td class="num"><template v-if="row.depth">{{ withBar(row.depth, 4) }}</template><span v-else class="dim">—</span></td>
    <td class="num"><template v-if="row.scatterPct !== null">{{ percent(row.scatterPct) }}</template><span v-else class="dim">—</span></td>
  </tr>
  <tr v-if="open" class="expand">
    <td colspan="6">
      <div class="note">{{ row.note }}</div>
      <KeyValue
        :items="[
          { k: 'dataset', v: row.dataset },
          { k: 'frames', v: `${frames} FITS · ${row.manifest}` },
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
tr.r {
  cursor: pointer;
}
tr.r:hover td {
  background: var(--card);
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
