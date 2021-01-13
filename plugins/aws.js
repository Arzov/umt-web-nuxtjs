import { Amplify, Hub } from '@aws-amplify/core'
import awsconfig from '~/aws-exports'

// Amplify.configure(awsconfig)
// Amplify.configure(awsconfig.arv)
// Amplify.configure(awsconfig.umt)

export default (ctx, inject) => {
  const AWS = Amplify
  AWS.configure(awsconfig.arv)
  AWS.Hub = Hub

  inject('AWS', AWS)
}
