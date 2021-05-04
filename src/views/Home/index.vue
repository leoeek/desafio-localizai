<template>
  <Header
    @create-account="handleAccountCreate"
    @login="handleLogin"
    @accountCreate="handleAccountCreate"
  />

  <section class="base">
    <div class="container">
      <div>
        <img src="@/assets/images/geolocalização.jpg" />
      </div>
      <div>
        <h2>Já pensou em usar a melhor tecnologia para ter a visão além do alcance?</h2>
        <p>O localiza-i amplia a sua visão utilizando o Google Maps para expandir suas escolhas!</p>
        <p><a href="#" @click="handleAccountCreate" title="Criar uma conta">Preciso do localiza-i <font-awesome-icon icon="smile" /></a></p>
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
    justify-content: center;

    div:last-child {
      padding-left: 40px;
    }
  }

  p {
    color: rgb(69, 100, 184);
    font-size: 1.8rem;
    line-height: 3.2rem;
    margin: 10px 0px 0px;

    a {
      background-color: #d67010;
      padding: 10px 20px;
      border-radius: 20px;
      color: #FFF;
      display: block;
      width: 250px;
      margin: 50px auto;

      &:hover {
        background-color: #e28937;
        font-weight: bold;
      }
    }
  }

  img {
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  section.base {
    .container {
      div:last-child {
        box-sizing: border-box;
        padding: 15px;
        text-align: center;
      }
    }
    img {
      width: 100%;
      min-width: 245px;
    }
  }
}

@media (max-width: 574px) {
  section.base {
    margin-top: 0;

    .container {
      width:  100%;
      flex-direction: column;

      div:last-child {
        box-sizing: border-box;
        padding: 5px 35px 0 25px;
      }
    }
    img {
      max-width: 100%;
    }
  }
}
</style>
