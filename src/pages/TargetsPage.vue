<script setup lang="ts">
import { api } from '@/api/observatory'
import GoLink from '@/components/ui/GoLink.vue'

const targets = api.targets()
</script>

<template>
  <h1>Targets</h1>
  <p class="lede">One page per planet ever opened. The O−C plot is the reason the site exists.</p>
  <div class="tbl-scroll">
    <table class="ledger">
      <thead>
        <tr><th>target</th><th class="num">V</th><th class="num">period</th><th class="num">opened</th><th class="num">fitted</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="t in targets" :key="t.slug">
          <td>{{ t.name }}</td>
          <td class="num">{{ t.vmag?.toFixed(1) ?? '—' }}</td>
          <td class="num">{{ t.periodDays != null ? `${t.periodDays.toFixed(5)} d` : '—' }}</td>
          <td class="num">{{ t.opened }}</td>
          <td class="num">{{ t.fitted }}</td>
          <td><GoLink :to="{ name: 'target', params: { slug: t.slug } }">open</GoLink></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
