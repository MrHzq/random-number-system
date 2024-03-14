import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './index.less' // https://v2.tailwindcss.com/docs/guides/vue-3-vite

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
