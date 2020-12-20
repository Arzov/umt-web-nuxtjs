import { Amplify, Hub } from '@aws-amplify/core'
import awsconfig from '~/aws-exports'

export default (ctx, inject) => {
  const AWS = Amplify
  AWS.configure(awsconfig.arv)
  AWS.Hub = Hub

  inject('AWS', AWS)
}
