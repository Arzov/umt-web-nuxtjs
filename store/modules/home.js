import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'

const actions = {
  listTeams (ctx, data) {
    return new Promise((resolve, reject) => {
      this.$AWS.Amplify.configure(awsconfig.umt)
      this.$AWS.API.graphql(
        graphqlOperation(umt.queries.listTeams, {
          email: data.email
        })
      )
        .then((result) => {
          const teamsIds = result.data.listTeams.items

          if (teamsIds) {
            teamsIds.forEach((id) => {
              this.$AWS.API.graphql(
                graphqlOperation(umt.queries.getTeam, {
                  id
                })
              )
                .then((result) => {
                  console.log(result)
                  // const params = {
                  //   geohash: result.data.addUser.geohash
                  // }
                  // TODO: Revisar si los commit son asincronos y decidir si hay que esperarlos o no
                  // ctx.commit('user/setState', { params }, { root: true })
                  resolve()
                })
                .catch((err) => {
                  const response = { ...errorNotification, err }
                  reject(response)
                })
            })
          }
          resolve()
        })
        .catch((err) => {
          const response = { ...errorNotification, err }
          reject(response)
        })
    })
  }
}

export default {
  namespaced: true,
  actions
}
