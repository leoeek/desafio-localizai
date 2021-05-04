<template>
  <div id="modal-comments">
    <h1>Avaliações</h1>
    <button @click="close">&times;</button>
  </div>

  <div>
    <form @submit.prevent="handleSubmit">
      <label>
        <textarea
          id="comment-field"
          v-model="state.comment.value"
          :class="{
            'border-brand-danger': !!state.comment.errorMessage
          }"
          placeholder="Descreva sua avaliação aqui ;)"
        >
        </textarea>
        <span
          id="comment-error"
          class="text-danger"
          v-if="!!state.comment.errorMessage"
        >
          {{ state.comment.errorMessage }}
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
        <span>Gravar</span>
      </button>
    </form>

    <div v-if="state.isLoading">Carregando...</div>
    <div
    v-else
    class="box-comments">
      <div
      class="item-comment"
      v-for="(item, i) in state.comments"
      :key="i">
        <p><b>{{item.user}}</b>, <i>{{item.date}}</i>:</p>
        <div>{{item.text}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue'
import { useField } from 'vee-validate'
import { useToast } from 'vue-toastification'
import useModal from '../../hooks/useModal'
import { validateEmptyAndLength3 } from '../../utils/validators'
import useStore from '@/hooks/useStore'
export default {
  setup () {
    const modal = useModal()
    const toast = useToast()
    const store = useStore('Place')
    const storeUser = useStore('User')

    const {
      value: commentValue,
      errorMessage: commentErrorMessage
    } = useField('comment', validateEmptyAndLength3)

    const state = reactive({
      hasErrors: false,
      isLoading: false,
      place_id: false,
      user: '',
      commentsAll: [],
      comments: [],
      comment: {
        value: commentValue,
        errorMessage: commentErrorMessage
      }
    })

    onMounted(() => {
      state.isLoading = true

      state.place_id = store.place.place_id
      state.user = storeUser.currentUser.first_name

      if (window.localStorage.getItem('comments')) {
        state.commentsAll = JSON.parse(window.localStorage.getItem('comments'))
        const newList = []
        state.commentsAll.forEach((item) => {
          if (item.id === state.place_id) {
            newList.push(item.comments)
          }
        })

        state.comments = newList
      }

      state.isLoading = false
    })

    async function handleSubmit () {
      try {
        toast.clear()

        if (state.comment.value === undefined || state.comment.value.length < 3) {
          toast.error('O comentário é obrigatório!')
          return
        }

        state.isLoading = true
        const dt = new Date()
        const df = new Intl.DateTimeFormat('pt', { dateStyle: 'full', timeStyle: 'long' })

        const comment = {
          id: state.place_id,
          comments: {
            text: state.comment.value,
            date: df.format(dt),
            user: state.user
          }
        }

        let comments = state.commentsAll
        comments.push(comment)
        window.localStorage.setItem('comments', JSON.stringify(comments))

        state.comment.value = ''

        comments = state.comments
        comments.push(comment.comments)
        state.comments = comments

        state.isLoading = false
      } catch (error) {
        state.isLoading = false
        state.hasErrors = !!error
        toast.error('Ocorreu um erro ao gravar comentário')
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
#modal-comments {
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

  button {
    padding: 9px 25px;
    margin-top: 10px;
    font-weight: bold;
    color: #FFF;
    border-radius: 5px;
    border-color: transparent;
    background-color: #0086c6;
  }

  textarea {
    width: 100%;
    height: 100px;
    border: 1px solid silver;
    padding: 10px;
  }
}

.box-comments {
  margin-top: 20px;

  .item-comment {
    border: 1px solid rgb(226, 226, 226);
    padding: 10px;
    margin-bottom: 6px;
    font-size: 1.3rem;
    white-space: pre;

    p {
      margin-bottom: 10px;
      font-size: 1.2rem;
    }
  }
}
</style>
