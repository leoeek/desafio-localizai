<template>
  <header-private />

  <section>
    <form>
      <div>
        <div>
          <div>
            <input type="text" placeholder="Informe sua localização" v-model="coordinates" />
            <button type="button" @click="locatorButtonPressed">Localização</button>
          </div>
        </div>
        <div>
          <div>
            <div>
              <select v-model="state.radius">
                <option value="5">5 KM</option>
                <option value="10">10 KM</option>
                <option value="15">15 KM</option>
                <option value="20">20 KM</option>
              </select>
            </div>
          </div>
        </div>
        <button title="Inciar a pesquisa" @click.prevent="findCloseBuyButtonPressed">localiza-i</button>
      </div>
    </form>

    <div class="box-result">
      <div>
        <div class="item" v-for="place in state.places" :key="place.id">
          <div class="image">
            <img :src="place.icon" alt="Icone do establecimento" />
          </div>
          <div class="content">
              <div class="place-name">{{place.name}}</div>
              <div class="meta">{{place.vicinity}}</div>
          </div>
          <div class="rating">
            <div>{{place.rating}}</div>
            <div><span>{{place.open_now ? 'Aberto' : 'Fecahdo'}}</span></div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import HeaderPrivate from '@/components/HeaderPrivate'
import { computed, onMounted, reactive } from '@vue/runtime-core'
import axios from 'axios'
// import { Loader } from '@googlemaps/js-api-loader'

// const google = window.google
export default {
  components: { HeaderPrivate },
  setup () {
    const state = reactive({
      map: {},
      lat: 0,
      lng: 0,
      radius: '',
      places: []
    })

    const coordinates = computed(() => {
      return `${state.lat}, ${state.lng}`
    })

    /* eslint handle-callback-err: "warn" */
    function locatorButtonPressed () {
      navigator.geolocation.getCurrentPosition(
        position => {
          state.lat = position.coords.latitude
          state.lng = position.coords.longitude
        },
        (error) => {
          console.log('Error getting location')
        }
      )
    }

    function findCloseBuyButtonPressed () {
      console.log('type', state)
      // const url = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+toronto+canada&key=AIzaSyC-HqGre5iKGRLnz1nj4ZNZsu_0Dnap3UA'
      const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
            state.lat
          },${state.lng}&radius=${state.radius *
            1000}&key=AIzaSyC-HqGre5iKGRLnz1nj4ZNZsu_0Dnap3UA`
      axios.get(URL).then(response => {
        state.places = response.data.results
        console.log('aqui', response.data.results, URL)
        // state.addLocationsToGoogleMaps()
      }).catch(error => {
        console.log(error.message)
      })
    }

    onMounted(() => {
      // loadMap()
    })

    return {
      HeaderPrivate,
      state,
      locatorButtonPressed,
      findCloseBuyButtonPressed,
      coordinates
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  width: 100%;
  max-width: 700px;
  margin: 20px auto;
}
.box-result {
  > div {
    border: 1px solid silver;
    margin-top: 20px;
  }
  .item {
    border-bottom: 1px solid silver;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .place-name {
      font-weight: bold;
    }

    .rating {
      text-align: center;
    }

    .content {
      flex: 1;
      padding: 10px 20px;
    }

    span {
      background-color: #0086c6;
      color: #FFF;
      border-radius: 15px;
      font-size: 1.2rem;
      padding: 4px 10px;
    }
  }
}

form {

  display: flex;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;

    div {
      display: flex;
    }
  }

  input {
    display: block;
    padding: 6px;
    margin-top: 1px;
    background-color: #F9F9F9;
    border-width: 2px;
    border-color: transparent;
    border-radius: 5px;
  }

  i {

  }
}
</style>
