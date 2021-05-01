<template>
  <div id="modal-login">
    <h1>Acesse sua conta</h1>
    <button @click="close">&times;</button>
  </div>

  <div>
    <form @submit.prevent="handleSubmit">
      <label>
        <span class="lb">E-mail</span>
        <input
          id="email-field"
          v-model="state.email.value"
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
          v-model="state.password.value"
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
        <span>Entrar</span>
      </button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useField } from 'vee-validate'
import { useToast } from 'vue-toastification'
import useModal from '../../hooks/useModal'
// import Icon from '../Icon'
import { validateEmptyAndLength3, validateEmptyAndEmail } from '../../utils/validators'
import services from '../../services'
export default {
  // components: { Icon },
  setup () {
    const router = useRouter()
    const modal = useModal()
    const toast = useToast()

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
      email: {
        value: emailValue,
        errorMessage: emailErrorMessage
      },
      password: {
        value: passwordValue,
        errorMessage: passwordErrorMessage
      }
    })

    async function handleSubmit () {
      try {
        toast.clear()
        state.isLoading = true
        const { data, errors } = await services.auth.login({
          email: state.email.value,
          password: state.password.value
        })

        if (!errors) {
          window.localStorage.setItem('token', data.token)
          router.push({ name: 'Maps' })
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
        console.log('error', error)
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
