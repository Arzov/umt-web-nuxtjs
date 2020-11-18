// import { addUser } from '@/graphql/mutations'
// import { getUser, getUmatchUser } from '@/graphql/queries'

const getDefaultState = () => ({
  email: null,
  firstName: null,
  lastName: null,
  birthdate: null,
  gender: null,
  picture: null,
  latitude: null,
  longitude: null,
  geohash: null,
  matchFilter: null,
  genderFilter: null,
  ageMinFilter: null,
  ageMaxFilter: null,
  verified: true
})

const state = getDefaultState()

const getters = {
  userData (state) {
    return state
  }
}

const actions = {
//   fetchUserData (context, data) {
//     // Usar API de Arzov
//     this.$AWS.API._options.aws_appsync_graphqlEndpoint = process.env.NUXT_ENV_AWS_APPSYNC_ARZOV_URL

  //     // Obtener datos del usuario
  //     this.$AWS.API.graphql(this.$AWS.Query(getUser, { hashKey: data.idToken.payload.email }))
  //       .then((result) => {
  //         const params = {
  //           email: result.data.getUser.hashKey,
  //           firstName: result.data.getUser.firstName,
  //           lastName: result.data.getUser.lastName,
  //           birthdate: result.data.getUser.birthdate,
  //           gender: result.data.getUser.gender,
  //           picture: result.data.getUser.picture
  //         }

  //         // TODO: Si picture == email+profile.png entonces usar this.$AWS.Storage.get() para traer la url de la imagen

  //         context.commit('setState', { params })

  //         // Usar API de Umatch
  //         this.$AWS.API._options.aws_appsync_graphqlEndpoint = process.env.NUXT_ENV_AWS_APPSYNC_UMATCH_URL

  //         // Obtener datos Umatch del usuario
  //         this.$AWS.API.graphql(this.$AWS.Query(getUmatchUser, { rangeKey: params.email }))
  //           .then((result) => {
  //             // Guardar filtros si existen desde DynamoDB
  //             if (result.data.getUser.items.length) {
  //               const params = {
  //                 matchFilter: result.data.getUser.items[0].matchFilter,
  //                 genderFilter: result.data.getUser.items[0].genderFilter,
  //                 ageMinFilter: result.data.getUser.items[0].ageMinFilter,
  //                 ageMaxFilter: result.data.getUser.items[0].ageMaxFilter
  //               }

  //               context.commit('setState', { params })
  //             }

  //             // Redireccionar a Home
  //             this.$router.push(process.env.routes.home.path)
  //           })
  //         // eslint-disable-next-line no-console
  //           .catch(e => console.log(e))
  //       })
  //     // eslint-disable-next-line no-console
  //       .catch(e => console.log(e))
  //   },
  //   updatePosition (context, data) {
  //     // Usar API de Umatch
  //     this.$AWS.API._options.aws_appsync_graphqlEndpoint = process.env.NUXT_ENV_AWS_APPSYNC_UMATCH_URL

  //     // Actualizar posicion del usuario
  //     this.$AWS.API.graphql(this.$AWS.Query(addUser, data))
  //       .then((result) => {
  //         const params = {
  //           latitude: data.latitude,
  //           longitude: data.longitude,
  //           geohash: result.data.addUser.hashKey
  //         }

  //         context.commit('setState', { params })

  //         // Si la llamada viene desde el componente geoloc, entonces quitar popup de geoloc
  //         if (data.isSavePosition) {
  //           context.dispatch('geoloc/update', { toggle: false }, { root: true })
  //         }
  //       })
  //     // eslint-disable-next-line no-console
  //       .catch(e => console.log(e))
  //   },
  resetStates (ctx) {
    ctx.commit('resetStates')
  }
}

const mutations = {
  setState (state, { params }) {
    for (const key in params) {
      state[key] = params[key]
    }
  },
  resetStates (state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
