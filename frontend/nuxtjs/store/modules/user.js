import { graphqlOperation } from '@aws-amplify/api'
import { arv, umt } from '@/graphql/gql'
import awsconfig from '~/aws-exports'

const getLocalStorageState = key => (localStorage.getItem(key))

const getDefaultState = () => ({
  email: getLocalStorageState('email') || null,
  firstName: getLocalStorageState('firstName') || null,
  lastName: getLocalStorageState('lastName') || null,
  birthdate: getLocalStorageState('birthdate') || null,
  gender: getLocalStorageState('gender') || null,
  picture: getLocalStorageState('picture') || null,
  coords: getLocalStorageState('coords') || null,
  geohash: getLocalStorageState('geohash') || null,
  matchFilter: getLocalStorageState('matchFilter') || null,
  genderFilter: getLocalStorageState('genderFilter') || null,
  ageMinFilter: getLocalStorageState('ageMinFilter') || null,
  ageMaxFilter: getLocalStorageState('ageMaxFilter') || null,
  positions: getLocalStorageState('positions') || null,
  foot: getLocalStorageState('foot') || null,
  weight: getLocalStorageState('weight') || null,
  height: getLocalStorageState('height') || null
})

const state = getDefaultState()

const getters = {
  getUser (state) {
    return state
  }
}

const actions = {
  fetchUser (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

    return new Promise((resolve, reject) => {
      this.$AWS.configure(awsconfig.arv)
      this.$AWS.API.graphql(graphqlOperation(arv.queries.getUser, {
        email: data.email
      }))
        .then((result) => {
          const params = {
            email: result.data.getUser.email,
            firstName: result.data.getUser.firstName,
            lastName: result.data.getUser.lastName,
            birthdate: result.data.getUser.birthdate,
            gender: result.data.getUser.gender,
            picture: result.data.getUser.picture
          }

          // TODO: Si picture == email+profile.png entonces usar
          //       this.$AWS.Storage.get() para traer la url de la imagen

          ctx.commit('setState', { params })

          this.$AWS.configure(awsconfig.umt)
          this.$AWS.API.graphql(graphqlOperation(umt.queries.getUser, {
            email: data.email
          }))
            .then((result) => {
              if (result.data.getUser.email) {
                const params = {
                  geohash: result.data.getUser.geohash,
                  coords: result.data.getUser.coords,
                  genderFilter: result.data.getUser.genderFilter,
                  ageMinFilter: result.data.getUser.ageMinFilter,
                  ageMaxFilter: result.data.getUser.ageMaxFilter,
                  matchFilter: result.data.getUser.matchFilter,
                  positions: result.data.getUser.positions,
                  foot: result.data.getUser.foot,
                  weight: result.data.getUser.weight,
                  height: result.data.getUser.height
                }

                ctx.commit('setState', { params })
              }

              resolve(ctx.getters.getUser)
            })
            .catch((err) => {
              const params = {
                notificationMsgType: 'error',
                notificationTitle: '¡Ups!',
                notificationMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
              }
              ctx.commit('global/setState', { params }, { root: true })
              reject(err)
            })
        })
        .catch((err) => {
          const params = {
            notificationMsgType: 'error',
            notificationTitle: '¡Ups!',
            notificationMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
          }
          ctx.commit('global/setState', { params }, { root: true })
          reject(err)
        })
    })
  },
  // updatePosition (context, data) {
  //   // Usar API de Umatch
  //   this.$AWS.API._options.aws_appsync_graphqlEndpoint = process.env.NUXT_ENV_AWS_APPSYNC_UMATCH_URL

  //   // Actualizar posicion del usuario
  //   this.$AWS.API.graphql(this.$AWS.Query(addUser, data))
  //     .then((result) => {
  //       const params = {
  //         latitude: data.latitude,
  //         longitude: data.longitude,
  //         geohash: result.data.addUser.hashKey
  //       }

  //       context.commit('setState', { params })

  //       // Si la llamada viene desde el componente geoloc, entonces quitar popup de geoloc
  //       if (data.isSavePosition) {
  //         context.dispatch('geoloc/update', { toggle: false }, { root: true })
  //       }
  //     })
  //     // eslint-disable-next-line no-console
  //     .catch(e => console.log(e))
  // },
  resetStates (ctx) {
    ctx.commit('resetStates')
  }
}

const mutations = {
  setState (state, { params }) {
    for (const key in params) {
      localStorage.setItem(key, params[key])
      state[key] = params[key]
    }
  },
  resetStates (state) {
    for (const key in state) {
      localStorage.setItem(key, null)
      state[key] = null
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
