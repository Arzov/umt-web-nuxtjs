import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import awsconfig from '~/aws-exports'

const actions = {
  save (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

    return new Promise((resolve, reject) => {
      this.$AWS.configure(awsconfig.umt)
      this.$AWS.API.graphql(
        graphqlOperation(umt.mutations.addUser, {
          latitude: 0,
          longitude: 0,
          email: data.email,
          genderFilter: data.genderFilter,
          ageMinFilter: data.ageFilter[0],
          ageMaxFilter: data.ageFilter[1],
          matchFilter: data.matchFilter,
          positions: data.positions,
          skills: data.skills,
          foot: data.foot,
          weight: data.weight,
          height: data.height
        })
      )
        .then(() => {
          const params = {
            genderFilter: data.genderFilter,
            ageMinFilter: data.ageFilter[0],
            ageMaxFilter: data.ageFilter[1],
            matchFilter: data.matchFilter
          }
          ctx.commit('user/setState', { params }, { root: true })
          this.$router.push('/home')
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
}

export default {
  namespaced: true,
  actions
}
