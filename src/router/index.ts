import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'ledger', component: () => import('@/pages/LedgerPage.vue') },
    { path: '/targets', name: 'targets', component: () => import('@/pages/TargetsPage.vue') },
    { path: '/targets/:slug', name: 'target', component: () => import('@/pages/TargetPage.vue'), props: true },
    { path: '/nights', name: 'nights', component: () => import('@/pages/NightsPage.vue') },
    { path: '/nights/:id', name: 'night', component: () => import('@/pages/NightPage.vue'), props: true },
    { path: '/method', name: 'method', component: () => import('@/pages/MethodPage.vue') },
    { path: '/run', name: 'run', component: () => import('@/pages/RunPage.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
  ],
})
