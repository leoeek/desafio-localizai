<template>
  <header>
    <div class="container">

        <img
          src="@/assets/images/logo.png"
          alt="Vue"
          height="90"
        />

        <div class="menu-section">

          <div class="menu-toggle">
            <div class="one"></div>
            <div class="two"></div>
            <div class="three"></div>
          </div>

          <nav>
            <ul>
              <li>
                <a
                href="#"
                title="Editar o seu perfil"
                @click="handlePerfil"
                >{{ logoutText }}</a>
              </li>
              <li>
                <a
                href="#"
                title="Sair do sistema"
                @click="handleLogout"
                >Sair</a>
              </li>
            </ul>
          </nav>

        </div>

      </div>
  </header>
</template>

<script>
import { useRouter } from 'vue-router'
import useStore from '@/hooks/useStore'
import { computed } from 'vue'
import { cleanCurrentUser } from '@/store/user'
import useModal from '@/hooks/useModal'

export default {
  setup () {
    const router = useRouter()
    const store = useStore('User')
    const modal = useModal()

    const logoutText = computed(() => {
      if (!store.currentUser.email) {
        return '...'
      }
      return store.currentUser.first_name
    })

    function handlePerfil () {
      modal.open({
        component: 'ModalPerfil'
      })
    }

    function handleLogout () {
      window.localStorage.removeItem('token')
      cleanCurrentUser()
      router.push({ name: 'Home' })
    }

    return {
      router,
      logoutText,
      handleLogout,
      handlePerfil
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  background-color: #4464aa;

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 90%;
    max-width: 980px;

    margin: auto;
  }

  img {
    width: 150px;
    margin-left: 20px;
    padding: 15px 0;
  }

  nav ul {
    display: flex;
  }

  nav ul li {
    list-style: none;
  }

  nav ul li a {
    text-decoration: none;
    color: white;
    text-transform: uppercase;
    font-size: 1.4rem;
    padding: 2.4rem;
    transition: all 250ms linear 0s;
  }

  nav ul li a:hover {
    background: rgba(255,255,255, 0.15)
  }
}
</style>
