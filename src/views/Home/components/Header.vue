<template>
  <header>
    <div class="container">

        <img
          src="@/assets/images/logo.png"
          alt="Vue"
          height="90"
        />

        <div class="menu-section">

          <nav>
            <ul>
              <li>
                <a
                href="#"
                @click="() => emit('accountCreate')"
                >Crie uma conta</a>
              </li>
              <li>
                <a
                href="#"
                @click="() => emit('login')"
                >Entrar</a>
              </li>
            </ul>
          </nav>

        </div>

      </div>
  </header>
</template>

<script>
export default {
  setup (_, { emit }) {
    return { emit }
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

@media (max-width: 425px) {
  header {
    img {
      margin-left: 0;
    }
    nav ul li a {
      padding: 1rem;
    }
  }
}

@media (max-width: 375px) {
  header {
    .container {
      width:  100%;
      flex-direction: column;

      .menu-section {
        padding-bottom: 20px;
      }
    }
  }
}

</style>
