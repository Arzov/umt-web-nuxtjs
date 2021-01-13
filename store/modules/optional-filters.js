import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'

const actions = {
  save (ctx, data) {
    return new Promise((resolve, reject) => {
      this.$AWS.Amplify.configure(awsconfig.umt)
      this.$AWS.API.graphql(
        graphqlOperation(umt.mutations.addUser, {
          latitude: 0,
          longitude: 0,
          email: data.email,
          genderFilter: data.genderFilter,
          ageMinFilter: data.ageFilter[0],
          ageMaxFilter: data.ageFilter[1],
          matchFilter: data.matchFilter,
          // TODO: Descomentar cuando optional_attributes este listo
          positions: null, // data.positions,
          skills: null, // data.skills,
          foot: 'R', // data.foot,
          weight: 0, // data.weight,
          height: 0 // data.height
        })
      )
        .then((result) => {
          const params = {
            geohash: result.data.addUser.geohash,
            height: result.data.addUser.height,
            weight: result.data.addUser.weight,
            foot: result.data.addUser.foot,
            skills: JSON.parse(result.data.addUser.skills),
            positions: result.data.addUser.positions,
            coords: JSON.parse(result.data.addUser.coords),
            genderFilter: result.data.addUser.genderFilter,
            ageMinFilter: result.data.addUser.ageMinFilter,
            ageMaxFilter: result.data.addUser.ageMaxFilter,
            matchFilter: result.data.addUser.matchFilter
          }
          // TODO: Revisar si los commit son asincronos y decidir si hay que esperarlos o no
          ctx.commit('user/setState', { params }, { root: true })
          this.$router.push('/home')
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
