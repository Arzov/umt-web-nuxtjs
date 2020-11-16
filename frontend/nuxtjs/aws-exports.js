const awsmobile = {
  Auth: {
    identityPoolId: process.env.NUXT_ENV_AWS_COGNITO_IDENTITY_POOL_ID,
    userPoolWebClientId: process.env.NUXT_ENV_AWS_COGNITO_USER_POOL_CLIENT_ID,
    userPoolId: process.env.NUXT_ENV_AWS_COGNITO_USER_POOL_ID,
    region: process.env.NUXT_ENV_AWS_DEFAULT_REGION,
    oauth: {
      domain: process.env.NUXT_ENV_AWS_COGNITO_USER_POOL_DOMAIN,
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: process.env.NUXT_ENV_ROOT_URL,
      redirectSignOut: process.env.NUXT_ENV_ROOT_URL,
      responseType: 'code'
    }
  },
  API: {
    aws_appsync_graphqlEndpoint: process.env.NUXT_ENV_AWS_APPSYNC_UMATCH_URL,
    aws_appsync_region: process.env.NUXT_ENV_AWS_DEFAULT_REGION,
    aws_appsync_authenticationType: process.env.NUXT_ENV_AWS_APPSYNC_AUTH_TYPE
  },
  Storage: {
    AWSS3: {
      bucket: process.env.NUXT_ENV_AWS_S3_ARZOV_ASSETS,
      region: process.env.NUXT_ENV_AWS_DEFAULT_REGION
    }
  }
}

export default awsmobile
