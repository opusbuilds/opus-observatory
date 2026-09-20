<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { SelectContent, SelectItem, SelectItemText, SelectPortal, SelectRoot, SelectTrigger, SelectValue, SelectViewport } from 'reka-ui'
import { computed } from 'vue'

defineProps<{ options: { value: string; label: string }[]; placeholder: string }>()
const model = defineModel<string>({ required: true })

const ALL = '__all__'
const selected = computed({
  get: () => model.value || ALL,
  set: (v: string) => (model.value = v === ALL ? '' : v),
})
</script>

<template>
  <SelectRoot v-model="selected">
    <SelectTrigger class="trigger" :aria-label="placeholder">
      <SelectValue :placeholder="placeholder" />
      <ChevronDown :size="12" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent class="select-content" position="popper" :side-offset="4">
        <SelectViewport>
          <SelectItem class="select-item" :value="ALL">
            <SelectItemText>{{ placeholder }}</SelectItemText>
          </SelectItem>
          <SelectItem v-for="o in options" :key="o.value" class="select-item" :value="o.value">
            <SelectItemText>{{ o.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style scoped>
.trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--ink);
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 4px;
  padding: 0.35rem 0.55rem;
  cursor: pointer;
}
:global(.select-content) {
  min-width: var(--reka-select-trigger-width);
  max-height: var(--reka-select-content-available-height);
  overflow-y: auto;
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 4px;
  font-family: var(--mono);
  font-size: 12.5px;
  z-index: 10;
}
:global(.select-item) {
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  outline: none;
}
:global(.select-item[data-highlighted]) {
  background: var(--green-soft);
  color: var(--green);
}
</style>
