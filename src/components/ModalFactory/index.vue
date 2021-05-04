<template>
  <teleport to="body">
    <div
      v-if="state.isActive"
      class="modal"
      @click="handleModalToogle({ status: false })"
    >
      <div
        class="modal-document"
        :class="state.width"
        @click.stop
      >
        <div class="animate__animated animate__fadeInDown animate__faster">
          <div class="">
            <component :is="state.component" />
          </div>
        </div>

      </div>
    </div>
  </teleport>
</template>

<script>
import { reactive, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import useModal from '@/hooks/useModal'
const ModalLogin = defineAsyncComponent(() => import('../ModalLogin'))
const ModalPerfil = defineAsyncComponent(() => import('../ModalPerfil'))
const ModalAccountCreate = defineAsyncComponent(() => import('../ModalAccountCreate'))
const ModalComments = defineAsyncComponent(() => import('../ModalComments'))
const DEFAULT_WIDTH = 'w-3/4 lg:w-1/3'

export default {
  components: {
    ModalLogin,
    ModalPerfil,
    ModalAccountCreate,
    ModalComments
  },
  setup () {
    const modal = useModal()
    const state = reactive({
      isActive: false,
      component: {},
      props: {},
      width: DEFAULT_WIDTH
    })

    onMounted(() => {
      modal.listen(handleModalToogle)
    })

    onBeforeUnmount(() => {
      modal.off(handleModalToogle)
    })

    function handleModalToogle (payload) {
      if (payload.status) {
        state.component = payload.component
        state.props = payload.props
        state.width = payload.width ?? DEFAULT_WIDTH
      } else {
        state.component = {}
        state.props = {}
        state.width = DEFAULT_WIDTH
      }
      state.isActive = payload.status
    }

    return {
      state,
      handleModalToogle
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width:  100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);

  .modal-document {
    position: fixed;
    width: 90%;
    max-width: 504px;
    min-height: 220px;

    > div {
      display: flex;
      height: 100%;
      flex-direction: column;
      overflow: hidden;
      background-color: #FFF;
      padding: 20px 25px;
    }
  }

}
</style>
