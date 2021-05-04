<template>
  <modal-factory />
  <router-view/>
</template>

<script>
import { watch } from 'vue'
import ModalFactory from '@/components/ModalFactory'
import { useRouter, useRoute } from 'vue-router'
import services from './services'
import { setCurrentUser } from '@/store/user'
export default {
  components: { ModalFactory },
  setup () {
    const router = useRouter()
    const route = useRoute()
    watch(() => route.path, async () => {
      if (route.meta.hasAuth) {
        const token = window.localStorage.getItem('token')
        if (!token) {
          router.push({ name: 'Home' })
          return
        }

        const { data } = await services.users.getProfile()
        setCurrentUser(data)
      }
    })
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  outline: 0;
}

html {
  font-size: 62.5%;
}

html,
body {
  height: 100vh;
  font-family: RobotoRegular, Avenir, Helvetica, Arial, sans-serif;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  font-size: 1.6rem;
}

button {
  cursor: pointer;
}

input {
  padding: 6px;
  background-color: #F9F9F9;
  border: 1px solid #c9c9c9;
  border-radius: 5px;
}

a {
  text-decoration: none;
}
</style>
