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
          :title="`Distância de ${state.radius} Km de alcance do filtro`"
          v-model="state.radius"
          v-on:change="handleSearch"
          />

          <span title="Distância do alcance da pesquisa">{{state.radius}} Km</span>
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
              <a
              href="#"
              @click.prevent="handleLike(place)"
              title="Adicionar como favorito"
              class="like"><font-awesome-icon icon="heart" :class="place.like ? 'icon-red' : ''" class="font-icon" /></a>

              <a
              href="#"
              @click.prevent="handleComment(place)"
              title="Comentar sobre o local"
              class="comment"><font-awesome-icon icon="comment" :class="place.comments ? 'icon-blue' : ''" class="font-icon" /></a>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div>
      <div class="map" ref="mapDivRef"></div>
    </div>

  </section>
</template>

<script>
import HeaderPrivate from '@/components/HeaderPrivate'
import { onMounted, reactive, ref } from '@vue/runtime-core'
import { useToast } from 'vue-toastification'
import useModal from '@/hooks/useModal'
import { setPlace } from '@/store/place'

export default {
  components: { HeaderPrivate },
  setup () {
    const modal = useModal()
    const toast = useToast()

    const state = reactive({
      isLoading: false,
      lat: 0,
      lng: 0,
      radius: 5,
      places: []
    })

    const mapDivRef = ref(null)
    let map
    let markers = []
    let pyrmont

    function handleSearch () {
      state.isLoading = true

      const services = new window.google.maps.places.PlacesService(map)
      const request = {
        location: pyrmont,
        radius: state.radius * 1000
      }
      services.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          state.places = results
          addLocationsToGoogleMaps()
          state.isLoading = false
        }
      })
    }

    function deleteMarkes () {
      if (markers.length > 0) {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null)
        }
        markers = []
      }
    }

    function addLocationsToGoogleMaps () {
      deleteMarkes()

      state.places.forEach((place) => {
        const placeLoc = place.geometry.location
        const result = new window.google.maps.Marker({
          position: placeLoc,
          map: map,
          title: place.name
        })
        markers.push(result)

        // marcando o objeto com like
        if (window.localStorage.getItem('likes')) {
          const likes = JSON.parse(window.localStorage.getItem('likes'))
          const found = likes.find(el => el === place.place_id)
          place.like = (found)
        }
      })
    }

    onMounted(() => {
      const error = (err) => {
        toast.error('Atenção! Não foi possível acessar a sua localização!')
        console.log('err', err)
      }

      if (!window.google) {
        var script = document.createElement('script')
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC-HqGre5iKGRLnz1nj4ZNZsu_0Dnap3UA&libraries=places&callback=initMap&v=weekly'
        script.async = true
        document.head.appendChild(script)
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          state.lat = position.coords.latitude // -22.117086
          state.lng = position.coords.longitude // -43.191759

          window.initMap = () => {
            pyrmont = new window.google.maps.LatLng(state.lat, state.lng)

            map = new window.google.maps.Map(mapDivRef.value, {
              zoom: 10,
              disableDefaultUI: false,
              mapTypeId: window.google.maps.MapTypeId.ROADMAP,
              center: pyrmont
            })

            handleSearch()
          }

          if (window.google) {
            window.initMap()
          }
        },
        error
      )
    })

    function handleLike (place) {
      const { place_id } = place
      if (place_id.length > 0) {
        let likes = []

        if (place.like) {
          likes = JSON.parse(window.localStorage.getItem('likes'))
          const i = likes.indexOf(place_id)
          likes.splice(i, 1)
          window.localStorage.setItem('likes', JSON.stringify(likes))
          place.like = false
          return
        }

        place.like = true
        if (window.localStorage.getItem('likes')) {
          likes = JSON.parse(window.localStorage.getItem('likes'))
        }

        likes.push(place_id)
        const likesUnique = [...new Set(likes)]
        window.localStorage.setItem('likes', JSON.stringify(likesUnique))
      }
    }

    function handleComment (place) {
      if (place.place_id.length > 0) {
        setPlace(place)
        modal.open({
          component: 'ModalComments'
        })
      }
    }

    return {
      HeaderPrivate,
      state,
      handleSearch,
      mapDivRef,
      handleLike,
      handleComment
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

  > div:first-child {
    width: 100%;
    max-width: 400px;
  }
  > div:last-child {
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

        .font-icon {
          font-size: 2.1rem;
        }
      }

      .like {
        :hover {
          color: red;
        }

        .icon-red {
          color: red;

          :hover {
            color: red;
          }
        }
      }

      .comment {
        :hover {
          color: #0086c6;
        }

        .icon-blue {
          color: #0086c6;

          :hover {
            color: #0086c6;
          }
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

@media (max-width: 1024px) {
  section {
    padding-left: 20px;

    .map {
      width: 94%
    }
  }
}
@media (max-width: 768px) {
  section {
    flex-direction: column;
    align-items: center;

    > div:last-child {
      min-width: 100%;
    }

    .map {
      width: 95%;
      margin: 65px 5px 20px;

    }
  }
}

</style>
