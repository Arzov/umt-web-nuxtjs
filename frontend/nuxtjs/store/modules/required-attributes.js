import { graphqlOperation } from '@aws-amplify/api'
import { arv } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'

const actions = {
  save (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

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
        .then(() => {
          const params = {
            birthdate,
            gender: data.gender
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
              params = errorNotification
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
