import { graphqlOperation } from '@aws-amplify/api'
import { umt } from '@/graphql/gql'
import errorNotification from '@/static/data/errorNotification.json'
import awsconfig from '~/aws-exports'


// actions

const actions = {

    save (ctx, data) {

        return new Promise((resolve, reject) => {

            const skills = data.skills ? JSON.stringify(data.skills) : null

            this.$AWS.Amplify.configure(awsconfig.umt)

            this.$AWS.API.graphql(
                graphqlOperation(umt.mutations.addUser, {
                    latitude        : 0,
                    longitude       : 0,
                    email           : data.email,
                    ageMinFilter    : data.ageFilter[0],
                    ageMaxFilter    : data.ageFilter[1],
                    matchFilter     : data.matchFilter,
                    positions       : data.positions,
                    foot            : data.foot,
                    weight          : data.weight,
                    height          : data.height,
                    skills
                })
            )


                // success
                .then((result) => {

                    const addUserResult = result.data.addUser

                    const params = {
                        geohash         : addUserResult.geohash,
                        height          : addUserResult.height,
                        weight          : addUserResult.weight,
                        foot            : addUserResult.foot,
                        skills          : JSON.parse(addUserResult.skills),
                        positions       : addUserResult.positions,
                        coords          : JSON.parse(addUserResult.coords),
                        ageMinFilter    : addUserResult.ageMinFilter,
                        ageMaxFilter    : addUserResult.ageMaxFilter,
                        matchFilter     : addUserResult.matchFilter
                    }

                    ctx.commit('user/setState', { params }, { root: true })
                    resolve()

                })


                // error
                .catch((err) => {
                    const response = { ...errorNotification, err }

                    reject(response)
                })

        })

    }

}


// export modules

export default {
    namespaced: true,
    actions
}
