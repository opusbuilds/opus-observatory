import { createApp } from 'vue'
import App from './App.vue'
import { loadPublished } from './api/observatory'
import { router } from './router'
import './styles/base.css'

try {
  await loadPublished()
} catch (e) {
  console.error('published data unavailable', e)
}
createApp(App).use(router).mount('#app')
