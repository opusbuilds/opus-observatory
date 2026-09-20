<script setup lang="ts">
import { useRouter } from 'vue-router'
import { api } from '@/api/observatory'
import GoLink from '@/components/ui/GoLink.vue'

const router = useRouter()
const targets = api.targets()
const opened = (name: string) => api.observationsFor(name)
const fitted = (name: string) => opened(name).filter((o) => o.status !== 'rejected')
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
        <tr v-for="t in targets" :key="t.slug" class="r" @click="router.push({ name: 'target', params: { slug: t.slug } })">
          <td>{{ t.name }}</td>
          <td class="num">{{ t.vmag.toFixed(1) }}</td>
          <td class="num">{{ t.periodDays.toFixed(5) }} d</td>
          <td class="num">{{ opened(t.name).length }}</td>
          <td class="num">{{ fitted(t.name).length }}</td>
          <td><GoLink :to="{ name: 'target', params: { slug: t.slug } }">open</GoLink></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
tr.r {
  cursor: pointer;
}
tr.r:hover td {
  background: var(--card);
}
</style>
