import { graphqlOperation } from '@aws-amplify/api'
import { updateUser } from '@/graphql/mutations'
import awsconfig from '~/aws-exports'

const getDefaultState = () => ({
  saveStatus: true,
  saveTitle: '',
  saveMsg: '',
  saveMsgType: 'success'
})

const state = getDefaultState

const getters = {
  getStates (state) {
    return state
  }
}

const actions = {
  save (ctx, data) {
    ctx.commit('resetStates')
    return new Promise((resolve, reject) => {
      const birthdate = `${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}`

      this.$AWS.configure(awsconfig.arv)
      this.$AWS.API.graphql(
        /* TODO: Conectar store del usuario */
        graphqlOperation(updateUser, {
          email: /* data.email, */ 'diegolagosbeltran@gmail.com',
          birthdate,
          gender: data.gender,
          firstName: /* data.firstName */ 'Diego',
          lastName: /* data.lastName */ 'Lagos Beltrán',
          picture: /* data.picture */ 'https://lh3.googleusercontent.com/a-/AOh14GgqghYLNJQrifSvh2D-jdcCpn_v93Q4SovGINRi=s96-c'
        })
      )
        .then(() => {
          /* this.$router.push('/start') */
          /* TODO: guardar datos del usuario en su store */
          console.log('entró al then')
          resolve()
        })
        .catch((err) => {
          console.log(err)
          switch (err.code) {
            // Error desconocido
            default: {
              const params = {
                saveStatus: false,
                saveMsgType: 'error',
                saveTitle: '¡Ups!',
                saveMsg: 'Algo inesperado ha sucedido. Inténtalo más tarde.'
              }
              ctx.commit('setState', { params })
              resolve()
              break
            }
          }
        })
    }
    )
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
