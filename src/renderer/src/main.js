import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'

import IssuesView from '@/components/Issues.vue'
import SettingsView from '@/components/Settings.vue'
import App from './App.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: IssuesView },
    { path: '/settings', component: SettingsView }
  ]
})

createApp(App).use(createPinia()).use(router).mount('#app')
