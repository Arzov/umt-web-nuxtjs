#!/bin/bash
# ==========================================================
# Init environment variables
# @author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================

# ----------------------------------------------------------
#  Import variables from AWS CloudFormation
# ----------------------------------------------------------

# ARV
export NUXT_ENV_AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION

aws cloudformation describe-stacks \
    --stack-name arv \
	--query 'Stacks[0].Outputs[?OutputKey==`CGUserPoolARVId`].OutputValue' \
	--output text > tmp; export NUXT_ENV_AWS_COGNITO_USER_POOL_ID=$(cat tmp); rm tmp

aws cloudformation describe-stacks \
    --stack-name arv \
	--query 'Stacks[0].Outputs[?OutputKey==`CGUserPoolClientARVId`].OutputValue' \
	--output text > tmp; export NUXT_ENV_AWS_COGNITO_USER_POOL_CLIENT_ID=$(cat tmp); rm tmp

aws cloudformation describe-stacks \
    --stack-name arv \
	--query 'Stacks[0].Outputs[?OutputKey==`CGUserPoolDomainARVId`].OutputValue' \
	--output text > tmp; export NUXT_ENV_AWS_COGNITO_USER_POOL_DOMAIN=$(cat tmp); rm tmp

export NUXT_ENV_AWS_COGNITO_USER_POOL_DOMAIN=$NUXT_ENV_AWS_COGNITO_USER_POOL_DOMAIN.auth.$AWS_DEFAULT_REGION.amazoncognito.com

aws cloudformation describe-stacks \
    --stack-name arv \
	--query 'Stacks[0].Outputs[?OutputKey==`ASGraphQLApiARVUrl`].OutputValue' \
	--output text > tmp; export NUXT_ENV_AWS_APPSYNC_ARZOV_URL=$(cat tmp); rm tmp

aws cloudformation describe-stacks \
    --stack-name arv \
	--query 'Stacks[0].Outputs[?OutputKey==`S3BucketARVAssetsId`].OutputValue' \
	--output text > tmp; export NUXT_ENV_AWS_S3_ARZOV_ASSETS=$(cat tmp); rm tmp

aws cloudformation describe-stacks \
    --stack-name arv \
	--query 'Stacks[0].Outputs[?OutputKey==`CGIdentityPoolARVId`].OutputValue' \
	--output text > tmp; export NUXT_ENV_AWS_COGNITO_IDENTITY_POOL_ID=$(cat tmp); rm tmp

# UMT
aws cloudformation describe-stacks \
    --stack-name umt \
	--query 'Stacks[0].Outputs[?OutputKey==`ASGraphQLApiUMTUrl`].OutputValue' \
	--output text > tmp; export NUXT_ENV_AWS_APPSYNC_UMATCH_URL=$(cat tmp); rm tmp

export NUXT_ENV_ROOT_URL=https://$AWS_R53_UMT_DOMAIN

aws cloudformation describe-stacks \
    --stack-name umt \
	--query 'Stacks[0].Outputs[?OutputKey==`CFDistributionUMTWebId`].OutputValue' \
	--output text > tmp; export AWS_CLOUDFRONT_ID=$(cat tmp); rm tmp

export NUXT_ENV_AWS_APPSYNC_AUTH_TYPE=AMAZON_COGNITO_USER_POOLS

aws cloudformation describe-stacks \
    --stack-name umt \
	--query 'Stacks[0].Outputs[?OutputKey==`S3BucketUMTWebId`].OutputValue' \
	--output text > tmp; export AWS_S3_WEB_BUCKET=$(cat tmp); rm tmp


# ----------------------------------------------------------
#  Import variables from GCP
# ----------------------------------------------------------

# export NUXT_ENV_GCP_API_KEY=XXXX