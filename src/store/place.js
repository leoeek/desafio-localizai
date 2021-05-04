import { reactive } from 'vue'

const placeInitialState = {
  place: {}
}

const state = reactive(placeInitialState)
export default state

export function setPlace (place) {
  state.place = place
}
