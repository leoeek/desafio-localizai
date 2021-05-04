import { createApp } from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar, faHeart, faComment, faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'animate.css'
import '@/assets/css/fonts.css'
import 'vue-toastification/dist/index.css'

library.add([faStar, faHeart, faComment, faSmile])
const app = createApp(App)
app.use(router)
app.use(Toast, { position: POSITION.BOTTOM_RIGHT })
  .component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
