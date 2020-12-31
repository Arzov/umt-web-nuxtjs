import { graphqlOperation } from '@aws-amplify/api'
import { arv, umt } from '@/graphql/gql'
import awsconfig from '~/aws-exports'

const getLocalStorageState = (key) => {
  // localStorage guarda todos los estados como 'string'
  // por lo que se debe en algunos casos usar JSON.parse()
  // para obtener el tipo de dato correcto
  if (localStorage.getItem(key) === 'null') {
    return JSON.parse(localStorage.getItem(key))
  } else {
    return localStorage.getItem(key)
  }
}

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
  skills: getLocalStorageState('skills') || null,
  weight: getLocalStorageState('weight') || null,
  height: getLocalStorageState('height') || null
})

const state = getDefaultState()

const getters = {
  get (state) {
    return state
  }
}

const actions = {
  fetch (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

    return new Promise((resolve, reject) => {
      this.$AWS.Amplify.configure(awsconfig.arv)
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

          this.$AWS.Amplify.configure(awsconfig.umt)
          this.$AWS.API.graphql(graphqlOperation(umt.queries.getUser, {
            email: data.email
          }))
            .then((result) => {
              const params = {
                geohash: result.data.getUser.geohash || null,
                coords: result.data.getUser.coords || null,
                genderFilter: result.data.getUser.genderFilter || null,
                ageMinFilter: result.data.getUser.ageMinFilter || null,
                ageMaxFilter: result.data.getUser.ageMaxFilter || null,
                matchFilter: result.data.getUser.matchFilter || null,
                positions: result.data.getUser.positions || null,
                foot: result.data.getUser.foot || null,
                skills: result.data.getUser.skills || null,
                weight: result.data.getUser.weight || null,
                height: result.data.getUser.height || null
              }

              ctx.commit('setState', { params })

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
  update (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

    if (data.api === 'arv') {
      return new Promise((resolve, reject) => {
        const birthdate = `${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}`

        this.$AWS.Amplify.configure(awsconfig.arv)
        this.$AWS.API.graphql(
          graphqlOperation(arv.mutations.updateUser, {
            email: data.email,
            birthdate,
            gender: data.gender,
            firstName: data.firstName,
            lastName: data.lastName || '',
            picture: data.picture || ''
          })
        )
          .then((result) => {
            console.log(result)
            // const params = {
            //   birthdate,
            //   gender: data.gender
            // }
            // ctx.commit('setState', { params })
            resolve()
          })
          .catch((err) => {
            let params = {}

            switch (err.code) {
              // Error desconocido
              default: {
                params = {
                  notificationMsgType: 'error',
                  notificationTitle: '¡Ups!',
                  notificationMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
                }
                break
              }
            }

            ctx.commit('global/setState', { params }, { root: true })
            reject(err)
          })
      })
    } else {
      return new Promise((resolve, reject) => {
        this.$AWS.Amplify.configure(awsconfig.umt)
        this.$AWS.API.graphql(
          graphqlOperation(umt.mutations.updateUser, {
            latitude: data.latitude,
            longitude: data.longitude,
            email: data.email,
            genderFilter: data.genderFilter,
            ageMinFilter: data.ageMinFilter,
            ageMaxFilter: data.ageMaxFilter,
            matchFilter: data.matchFilter,
            positions: data.positions,
            skills: data.skills,
            foot: data.foot,
            weight: data.weight,
            height: data.height
          })
        )
          .then((result) => {
            console.log(result)
            // const params = {
            //   coords: { LON: 'asd' },
            //   genderFilter: data.genderFilter,
            //   ageMinFilter: data.ageMinFilter,
            //   ageMaxFilter: data.ageMaxFilter,
            //   matchFilter: data.matchFilter,
            //   positions: data.positions,
            //   skills: data.skills,
            //   foot: data.foot,
            //   weight: data.weight,
            //   height: data.height
            // }
            // ctx.commit('setState', { params })
            resolve()
          })
          .catch((err) => {
            let params = {}

            switch (err.code) {
              // Error desconocido
              default: {
                params = {
                  notificationMsgType: 'error',
                  notificationTitle: '¡Ups!',
                  notificationMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
                }
                break
              }
            }

            ctx.commit('global/setState', { params }, { root: true })
            reject(err)
          })
      })
    }
  },
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
      localStorage.removeItem(key)
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
