import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .use(VueApexCharts)
  .mount('#app')