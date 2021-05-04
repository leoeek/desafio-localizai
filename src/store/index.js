import { readonly } from 'vue'
import UserModule from './user'
import GlobalModule from './global'
import PlaceModule from './place'

export default readonly({
  User: UserModule,
  Place: PlaceModule,
  Global: GlobalModule
})
