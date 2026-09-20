import { ref, watchEffect } from 'vue'

type Theme = 'system' | 'light' | 'dark'

const stored = localStorage.getItem('theme') as Theme | null
const theme = ref<Theme>(stored ?? 'system')

watchEffect(() => {
  const root = document.documentElement
  if (theme.value === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
})

function resolved(): 'light' | 'dark' {
  if (theme.value !== 'system') return theme.value
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const toggle = () => {
    theme.value = resolved() === 'dark' ? 'light' : 'dark'
  }
  return { theme, resolved, toggle }
}
