<template>
  <header-private />

  <section>
    <div>
      <form>

        <div>
          <input
          type="range"
          min="5"
          max="30"
          step="5"
          list="tickmarks"
          :title="`Distância de ${state.radius} Km de alcance do filtro`"
          v-model="state.radius"
          v-on:change="findCloseBuyButtonPressed"
          />

          <span title="Distância">{{state.radius}} Km</span>
        </div>

      </form>

      <div class="box-result">
        <div
        v-if="state.isLoading"
        class="loading">
          Carregando...
        </div>

        <div v-else>
          <div class="item" v-for="place in state.places" :key="place.id">
            <div class="detail">
              <div class="image">
                <img :src="place.icon" alt="Icone do establecimento" />
              </div>
              <div class="content">
                  <div class="place-name">{{place.name}}</div>
                  <div class="vicinity">{{place.vicinity}}</div>
              </div>
              <div class="rating">
                <div>{{place.rating}}</div>
                <div><span :class="!place.open_now ? 'closed' : ''">{{place.open_now ? 'Aberto' : 'Fecahdo'}}</span></div>
              </div>
            </div>

            <div class="item-footer">
              <a href="#">Favorito <font-awesome-icon icon="star" /> s</a>
              <a href="#">Avaliar</a>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div>
      <div class="map" ref="mapDivRef"></div>
    </div>

  </section>

  <section>
  </section>
</template>

<script>
import HeaderPrivate from '@/components/HeaderPrivate'
import { computed, onMounted, reactive, ref } from '@vue/runtime-core'
import axios from 'axios'

export default {
  components: { HeaderPrivate },
  setup () {
    const state = reactive({
      isLoading: false,
      lat: 0,
      lng: 0,
      radius: 5,
      places: []
    })

    let map
    const markers = []
    const mapDivRef = ref(null)

    const coordinates = computed(() => {
      return `${state.lat}, ${state.lng}`
    })

    function findCloseBuyButtonPressed () {
      state.isLoading = true

      const radius = state.radius * 1000
      const URL = `${process.env.VUE_APP_GOOGLEMAPS_URL}/nearbysearch/json?location=${state.lat},${state.lng}&radius=${radius}&key=${process.env.VUE_APP_GOOGLEMAPS_KEY}`

      axios.get(URL).then(response => {
        state.places = response.data.results
        addLocationsToGoogleMaps()

        state.isLoading = false
      }).catch(error => {
        console.log(error.message)
        state.isLoading = false
      })
    }

    function addLocationsToGoogleMaps () {
      // limpando as marcações atuais
      // console.log('vai limpar geral', markers)
      // if (markers.length > 0) {
      //   for (let i = 0; i < markers; i++) {
      //     markers[i].setMap(map)
      //   }
      // }

      state.places.forEach((place) => {
        const lat = place.geometry.location.lat
        const lng = place.geometry.location.lng
        const result = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(lat, lng),
          map: map,
          title: place.name
        })
        markers.push(result)
      })
    }

    onMounted(() => {
      const error = (err) => {
        console.log('Error getting location', err)
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          state.lat = -22.117086 // position.coords.latitude
          state.lng = -43.191759 // position.coords.longitude

          window.initMap = () => {
            console.log('vai pegar', state.lat, state.lng)
            map = new window.google.maps.Map(mapDivRef.value, {
              zoom: 10,
              disableDefaultUI: false,
              mapTypeId: window.google.maps.MapTypeId.ROADMAP,
              center: { lat: state.lat, lng: state.lng }
            })
          }

          findCloseBuyButtonPressed()
        },
        error
      )
    })

    return {
      HeaderPrivate,
      state,
      findCloseBuyButtonPressed,
      coordinates,
      mapDivRef
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  width: 100%;
  max-width: 1024px;
  margin: 20px auto;

  display: flex;
  flex-direction: row;

  >div:first-child {
    width: 100%;
    max-width: 400px;
  }
  >div:last-child {
    flex: 1;
    min-width: 400px;
  }
}

.loading {
  text-align: center;
  padding: 20px;
  font-weight: bold;
  color: #0086c6;
}

.map {
  margin: 65px 20px 20px;
  box-sizing: border-box;
  height: 600px;
  width: 100%;
}

.box-result {
  > div {
    margin-top: 20px;
  }
  .item {
    background-color: #FFF;
    border: 1px solid rgb(240, 240, 240);
    box-sizing: border-box;
    font-size: 1.4rem;
    margin-bottom: 15px;

    -webkit-box-shadow: 0 5px 6px -6px #777;
    -moz-box-shadow: 0 5px 6px -6px #777;
    box-shadow: 0 5px 6px -6px #777;

    // position: relative;

    // :before, :after {
    //   z-index: -1;
    //   position: absolute;
    //   content: "";
    //   bottom: 15px;
    //   left: 10px;
    //   width: 50%;
    //   top: 80%;
    //   max-width:300px;
    //   background: #777;
    //   -webkit-box-shadow: 0 7px 10px #777;
    //   -moz-box-shadow: 0 7px 10px #777;
    //   box-shadow: 0 7px 10px #777;
    //   -webkit-transform: rotate(-3deg);
    //   -moz-transform: rotate(-3deg);
    //   -o-transform: rotate(-3deg);
    //   -ms-transform: rotate(-3deg);
    //   transform: rotate(-3deg);
    // }
    // :after {
    //   -webkit-transform: rotate(3deg);
    //   -moz-transform: rotate(3deg);
    //   -o-transform: rotate(3deg);
    //   -ms-transform: rotate(3deg);
    //   transform: rotate(3deg);
    //   right: 10px;
    //   left: auto;
    // }

    .detail {
      padding: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .place-name {
        font-weight: bold;
      }

      .image img {
        width: 54px;
      }

      .vicinity {
        color: #636363
      }

      .rating {
        text-align: center;
        font-weight: bold;
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
        margin-top: 5px;
        display: block;
      }
      span.closed {
        background-color: rgb(197, 78, 78);
      }
    }

    .item-footer {
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-top: 1px solid rgb(240, 240, 240);;

      a {
        text-decoration: none;
        color: rgb(71, 71, 71);
        font-weight: bold;
        font-size: 1.3rem;
        padding-top: 5px;
        padding-bottom: 5px;

        :hover {
          color: #0086c6
        }
      }
    }

  }
}

form {

  display: flex;
  align-items: center;
  justify-content: center;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    span {
      padding-left: 20px;
      padding-right: 10px;
      text-align: center;
      font-size: 1.4rem;
      display: flex;
      flex-direction: column;
      min-width: 90px;
    }
  }

  input[type=range] {
    height: 25px;
    -webkit-appearance: none;
    margin: 10px 0;
    padding-left: 20px;
    width: 100%;
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #2497E3;
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type=range]::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #2497E3;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: #A1D0FF;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -7px;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    background: #2497E3;
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #2497E3;
    border-radius: 1px;
    border: 0px solid #000000;
  }
  input[type=range]::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #2497E3;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: #A1D0FF;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    width: 100%;
    height: 5px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: #2497E3;
    border: 0px solid #000000;
    border-radius: 2px;
    box-shadow: 0px 0px 0px #000000;
  }
  input[type=range]::-ms-fill-upper {
    background: #2497E3;
    border: 0px solid #000000;
    border-radius: 2px;
    box-shadow: 0px 0px 0px #000000;
  }
  input[type=range]::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px #000000;
    border: 1px solid #2497E3;
    height: 18px;
    width: 18px;
    border-radius: 25px;
    background: #A1D0FF;
    cursor: pointer;
  }
  input[type=range]:focus::-ms-fill-lower {
    background: #2497E3;
  }
  input[type=range]:focus::-ms-fill-upper {
    background: #2497E3;
  }
}
</style>
