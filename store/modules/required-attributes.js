import { graphqlOperation } from '@aws-amplify/api'
import { updateUser } from '@/graphql/mutations'
import awsconfig from '~/aws-exports'

const actions = {
  save (ctx, data) {
    ctx.commit('global/resetStates', {}, { root: true })

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
          /* TODO: guardar datos del usuario en su store y enviar al home */
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
