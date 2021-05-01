<template>
  <Header
    @create-account="handleAccountCreate"
    @login="handleLogin"
  />

  <section class="base">
    <div class="container">
      <div>
        <h2>
          Já pensou em usar a tecnologia para ter uma visão além do alcance?
        </h2>
        <p>
          O LocalizaI amplia a sua visão utilizando o Google Maps, expandindo suas escolhas!
        </p>
        <a href="#" class="button">Preciso do localiza-i :)</a>
      </div>
    </div>
  </section>

  <Footer />

</template>

<script>
import Header from './components/Header.vue'
import Footer from '@/components/Footer'
import useModal from '@/hooks/useModal'

export default {
  components: { Header, Footer },
  setup () {
    const modal = useModal()

    function handleLogin () {
      modal.open({
        component: 'ModalLogin'
      })
    }
    function handleAccountCreate () {
      modal.open({
        component: 'ModalAccountCreate'
      })
    }
    return {
      handleLogin,
      handleAccountCreate
    }
  }
}
</script>

<style lang="scss" scoped>
section.base {
  margin: 80px 0;

  .container {
    width: 90%;
    max-width: 980px;

    margin: auto;

    display: flex;
  }

  p {
    color: rgb(154, 142, 191);
    font-size: 1.8rem;
    line-height: 3.2rem;
    margin: 10px 0px 0px;
  }
}
</style>
