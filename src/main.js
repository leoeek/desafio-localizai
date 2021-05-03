import { createApp } from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import App from './App.vue'
import router from './router'
// import GoogleMap from 'googlemaps-vue3'

import 'animate.css'
// import '@/assets/css/tailwind.css'
import '@/assets/css/fonts.css'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(Toast, { position: POSITION.BOTTOM_RIGHT })
// app.use(GoogleMap, { apiKey: 'AIzaSyC-HqGre5iKGRLnz1nj4ZNZsu_0Dnap3UA' })
app.mount('#app')
