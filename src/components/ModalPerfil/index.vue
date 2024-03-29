<template>
  <div id="modal-perfil">
    <h1>Olá {{ state.first_name }}</h1>
    <button @click="close">&times;</button>
  </div>

  <div>
    <form @submit.prevent="handleSubmit">
      <div>
        <img :src="state.avatar" alt="Foto do Avatar" />
      </div>

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
          {{ state.email.errorMessage }}
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
          placeholder="******"
          title="Informe a sua senha"
        >
      </label>

      <button
        id="submit-button"
        :disabled="state.isLoading"
        type="submit"
        title="Atualizar perfil"
        :class="{
          'opacity-50': state.isLoading
        }"
      >
        <span v-if="state.isLoading">Aguarde...</span>
        <span v-else>Atualizar</span>
      </button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useField } from 'vee-validate'
import { useToast } from 'vue-toastification'
import useModal from '@/hooks/useModal'
import { validateEmptyAndLength3, validateEmptyAndEmail } from '@/utils/validators'
import services from '@/services'
import useStore from '@/hooks/useStore'
export default {
  setup () {
    const modal = useModal()
    const toast = useToast()
    const store = useStore('User')

    const {
      value: nameValue,
      errorMessage: nameErrorMessage
    } = useField('name', validateEmptyAndLength3)

    const {
      value: lastNameValue,
      errorMessage: lastNameErrorMessage
    } = useField('lastName', validateEmptyAndLength3)

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
      name: {
        value: nameValue,
        errorMessage: nameErrorMessage
      },
      lastName: {
        value: lastNameValue,
        errorMessage: lastNameErrorMessage
      },
      email: {
        value: emailValue,
        errorMessage: emailErrorMessage
      },
      password: {
        value: passwordValue,
        errorMessage: passwordErrorMessage
      }
    })

    const user = store.currentUser
    state.avatar = user.avatar
    state.name.value = user.first_name
    state.lastName.value = user.last_name
    state.email.value = user.email
    state.password.value = ''

    async function handleSubmit () {
      try {
        toast.clear()

        if (state.password.value.length > 0 && state.password.value.length < 3) {
          toast.error('Atenção! A senha deve ter no mínimo 3 caracteres!')
          return
        }

        state.isLoading = true
        const { errors } = await services.users.updateProfile({
          first_name: state.name.value,
          last_name: state.lastName.value,
          email: state.email.value,
          password: state.password.value
        })

        if (!errors) {
          toast.success('Perfil atualizado com sucesso!')
          state.isLoading = false
          modal.close()
          return
        }

        if (errors.status === 400) {
          toast.error('Ops! Erro ao atualizar o perfil!')
        }
        state.isLoading = false
      } catch (error) {
        state.isLoading = false
        state.hasErrors = !!error
        toast.error('Ocorreu um erro ao atualizar o perfil!')
        console.log('er', error)
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
#modal-perfil {
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

  > div {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 94px;
      border-top-left-radius: 15px;
      border-bottom-right-radius: 15px;
      -webkit-box-shadow: 0 8px 6px -6px #777;
      -moz-box-shadow: 0 8px 6px -6px #777;
      box-shadow: 0 8px 6px -6px #777;
    }
  }

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
