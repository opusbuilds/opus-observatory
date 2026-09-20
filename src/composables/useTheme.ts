import { computed, ref, watchEffect } from 'vue'

type Theme = 'system' | 'light' | 'dark'

const storageKey = 'theme'

function readStored(): Theme {
  try {
    const v = localStorage.getItem(storageKey)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

function writeStored(theme: Theme) {
  try {
    localStorage.setItem(storageKey, theme)
  } catch {
    return
  }
}

const theme = ref<Theme>(readStored())
const darkQuery = matchMedia('(prefers-color-scheme: dark)')
const systemDark = ref(darkQuery.matches)
darkQuery.addEventListener('change', (e) => (systemDark.value = e.matches))

const resolved = computed<'light' | 'dark'>(() => (theme.value === 'system' ? (systemDark.value ? 'dark' : 'light') : theme.value))

watchEffect(() => {
  const root = document.documentElement
  if (theme.value === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme.value)
  writeStored(theme.value)
})

export function useTheme() {
  const toggle = () => {
    theme.value = resolved.value === 'dark' ? 'light' : 'dark'
  }
  return { resolved, toggle }
}
