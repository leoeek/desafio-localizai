<template>
  <div id="modal-account-create">
    <h1>Crie sua conta</h1>
    <button @click="close">&times;</button>
  </div>

  <div>
    <form @submit.prevent="handleSubmit">

      <label>
        <span class="lb">Nome</span>
        <input
          id="name-field"
          v-model="state.name.value"
          required
          type="text"
          :class="{
            'border-danger': !!state.name.errorMessage
          }"
          placeholder="Nome"
          title="Informe o seu nome"
        >
        <span
          id="name-error"
          class="text-danger"
          v-if="!!state.name.errorMessage"
        >
          {{ state.name.errorMessage }}
        </span>
      </label>

      <label>
        <span class="lb">Sobrenome</span>
        <input
          id="last-name-field"
          v-model="state.lastName.value"
          type="text"
          required
          :class="{
            'border-danger': !!state.lastName.errorMessage
          }"
          placeholder="Sobrenome"
          title="Informe o seu sobrenome"
        >
        <span
          id="last-name-error"
          class="text-danger"
          v-if="!!state.lastName.errorMessage"
        >
          {{ state.lastName.errorMessage }}
        </span>
      </label>

      <label>
        <span class="lb">E-mail</span>
        <input
          id="email-field"
          v-model="state.email.value"
          type="email"
          required
          :class="{
            'border-danger': !!state.email.errorMessage
          }"
          placeholder="seu-email@algo.com"
          title="Informe o seu email"
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
          required
          :class="{
            'border-danger': !!state.password.errorMessage
          }"
          placeholder="******"
          title="Informe a sua senha"
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
        title="Criar a conta"
        :class="{
          'opacity-50': state.isLoading
        }"
      >

        <span v-if="state.isLoading">Aguarde...</span>
        <span v-else>Criar</span>
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
import { validateEmptyAndLength3, validateEmptyAndEmail } from '../../utils/validators'
import services from '../../services'
export default {
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

    const {
      value: nameValue,
      errorMessage: nameErrorMessage
    } = useField('name', validateEmptyAndLength3)

    const {
      value: lastNameValue,
      errorMessage: lastNameErrorMessage
    } = useField('lastName', validateEmptyAndLength3)

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
      },
      name: {
        value: nameValue,
        errorMessage: nameErrorMessage
      },
      lastName: {
        value: lastNameValue,
        errorMessage: lastNameErrorMessage
      }
    })

    async function handleSubmit () {
      try {
        toast.clear()
        state.isLoading = true

        const { data, errors } = await services.auth.accountCreate({
          name: state.name.value,
          lastName: state.lastName.value,
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
#modal-account-create {
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
      margin-top: 1px;
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

  label {
    margin-top: 20px;
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
