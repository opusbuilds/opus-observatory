<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { resolved, toggle } = useTheme()

const links = [
  { to: '/', label: 'ledger' },
  { to: '/targets', label: 'targets' },
  { to: '/nights', label: 'nights' },
  { to: '/method', label: 'method' },
  { to: '/run', label: 'run', phase: 'phase 2' },
]
</script>

<template>
  <header class="site">
    <div class="brandline">
      <div class="brand">
        <b>observatory</b><span class="dim">.opusgarden.dev</span>
        <span class="chip">mockup · example data</span>
      </div>
      <button class="theme" type="button" :aria-label="`switch to ${resolved() === 'dark' ? 'light' : 'dark'} mode`" @click="toggle">
        <Sun v-if="resolved() === 'dark'" :size="14" />
        <Moon v-else :size="14" />
      </button>
    </div>
    <nav class="top">
      <RouterLink v-for="l in links" :key="l.to" :to="l.to" active-class="on">
        {{ l.label }}<span v-if="l.phase" class="p2"> ({{ l.phase }})</span>
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
header.site {
  padding: 2.2rem 0 1.1rem;
  border-bottom: 1px solid var(--line);
}
.brandline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.brand {
  font-family: var(--mono);
  font-size: 15px;
  letter-spacing: 0.02em;
}
.brand b {
  font-weight: 500;
}
.chip {
  display: inline-block;
  font-size: 11px;
  color: var(--amber);
  background: var(--amber-soft);
  padding: 1px 8px;
  border-radius: 3px;
  margin-left: 0.6rem;
  vertical-align: 2px;
}
.theme {
  background: none;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--muted);
  padding: 0.3rem 0.4rem;
  cursor: pointer;
  display: inline-flex;
}
.theme:hover {
  color: var(--ink);
}
nav.top {
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  font-family: var(--mono);
  font-size: 13px;
}
nav.top a {
  color: var(--muted);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
}
nav.top a.on {
  color: var(--ink);
  border-bottom-color: var(--green);
}
nav.top a:hover {
  color: var(--ink);
}
.p2 {
  color: var(--faint);
  font-size: 11px;
}
</style>
