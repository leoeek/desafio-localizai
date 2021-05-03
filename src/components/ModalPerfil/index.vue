<template>
  <div id="modal-login">
    <h1>Olá {{ state.first_name }}</h1>
    <button @click="close">&times;</button>
  </div>

  <div>
    <form @submit.prevent="handleSubmit">
      <div>
        <img :src="state.user.avatar" alt="Foto do Avatar" />
      </div>

      <label>
        <span class="lb">Nome</span>
        <input
          id="first-name-field"
          v-model="state.user.first_name"
          type="text"
          :class="{
            'border-brand-danger': !!state.email.errorMessage
          }"
          placeholder="Nome"
        >
        <span
          id="email-error"
          class="text-danger"
          v-if="!!state.email.errorMessage"
        >
          {{ state.email.errorMessage }}
        </span>
      </label>

      <label>
        <span class="lb">Sobrenome</span>
        <input
          id="last-name-field"
          v-model="state.user.last_name"
          type="text"
          :class="{
            'border-brand-danger': !!state.email.errorMessage
          }"
          placeholder="Sobrenome"
        >
        <span
          id="email-error"
          class="text-danger"
          v-if="!!state.email.errorMessage"
        >
          {{ state.email.errorMessage }}
        </span>
      </label>

      <label>
        <span class="lb">E-mail</span>
        <input
          id="email-field"
          v-model="state.user.email"
          type="email"
          :class="{
            'border-brand-danger': !!state.email.errorMessage
          }"
          placeholder="seu-email@algo.com"
        >
        <span
          id="email-error"
          class="text-danger"
          v-if="!!state.email.errorMessage"
        >
          {{ state.email.errorMessage }}
        </span>
      </label>

      <label>
        <span class="lb">Senha</span>
        <input
          id="password-field"
          v-model="state.user.password"
          type="password"
          :class="{
            'border-danger': !!state.password.errorMessage
          }"
          placeholder="******"
        >
        <span
          v-if="!!state.password.errorMessage"
          class="text-danger"
        >
          {{ state.password.errorMessage }}
        </span>
      </label>

      <button
        id="submit-button"
        :disabled="state.isLoading"
        type="submit"
        :class="{
          'opacity-50': state.isLoading
        }"
      >
        <!-- <icon v-if="state.isLoading" name="loading" class="animate-spin" /> -->
        <!-- <span v-else>Entrar</span> -->
        <span>Atualizar</span>
      </button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useField } from 'vee-validate'
import { useToast } from 'vue-toastification'
import useModal from '@/hooks/useModal'
// import Icon from '../Icon'
import { validateEmptyAndLength3, validateEmptyAndEmail } from '@/utils/validators'
import services from '@/services'
import useStore from '@/hooks/useStore'
export default {
  // components: { Icon },
  setup () {
    const modal = useModal()
    const toast = useToast()
    const store = useStore('User')

    const {
      value: emailValue,
      errorMessage: emailErrorMessage
    } = useField('email', validateEmptyAndEmail)

    const {
      value: passwordValue,
      errorMessage: passwordErrorMessage
    } = useField('password', validateEmptyAndLength3)

    const state = reactive({
      hasErrors: false,
      isLoading: false,
      user: {},
      email: {
        value: emailValue,
        errorMessage: emailErrorMessage
      },
      password: {
        value: passwordValue,
        errorMessage: passwordErrorMessage
      }
    })

    // state.user = computed(() => {
    //   if (store.currentUser.email) {
    //     return store.currentUser
    //   }
    //   return {}
    // })

    state.user = store.currentUser

    async function handleSubmit () {
      try {
        toast.clear()
        state.isLoading = true
        const { errors } = await services.users.updateProfile({
          first_name: state.user.first_name,
          last_name: state.user.last_name,
          email: state.user.email
        })

        if (!errors) {
          toast.success('Perfil atualizado com sucesso!')
          state.isLoading = false
          modal.close()
          return
        }

        if (errors.status === 404) {
          toast.error('Atenção! E-mail não encontrado')
        }
        if (errors.status === 401) {
          toast.error('Hummm, verifique E-mail/senha')
        }
        if (errors.status === 400) {
          toast.error('Ops! Ocorreu um erro ao fazer o login')
        }
        state.isLoading = false
      } catch (error) {
        state.isLoading = false
        state.hasErrors = !!error
        toast.error('Ocorreu um erro ao fazer o login')
      }
    }

    return {
      state,
      close: modal.close,
      handleSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
#modal-login {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  h1 {
    font-size: 2.5rem;
    font-family: RobotoBold;
    color: #000;
    margin-bottom: 10px;
  }

  button {
    font-size: 3.5rem;
    color: #979797;
    border: none;
    background-color: #FFF;

    :hover {
      color: #000
    }
  }
}

form {
  label {
    display: block;
    margin-bottom: 5px;

    span.lb {
      display: block;
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    input {
      display: block;
      width: 100%;
      padding: 6px;
      margin-top: 1px;
      background-color: #F9F9F9;
      border-width: 2px;
      border-color: transparent;
      border-radius: 5px;
    }

    .text-danger {
      color: #ca675a;
      font-size: 1rem;
      display: block;
    }
    .border-danger {
      border-color: #ca675a;
    }
  }

  label:nth-child(2) {
    margin-top: 30px;
  }

  button {
    padding: 9px 25px;
    margin-top: 10px;
    font-weight: bold;
    color: #FFF;
    border-radius: 5px;
    border-color: transparent;
    background-color: #0086c6;
  }
}
</style>
