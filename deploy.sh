#!/bin/bash
# ==========================================================
# Deploy to AWS
# @author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================
set -o errexit


# ----------------------------------------------------------
#  Load environment variables from AWS
# ----------------------------------------------------------

chmod +x env.sh; source ./env.sh


# ----------------------------------------------------------
#  Build sass files
# ----------------------------------------------------------

sass ./assets/styles/app.scss:./assets/styles/app.css


# ----------------------------------------------------------
#  Nuxt deploy
# ----------------------------------------------------------

export AWS_BUCKET_NAME="$AWS_S3_WEB_BUCKET"
export AWS_CLOUDFRONT="$AWS_CLOUDFRONT_ID"

# Npm install if not already.
[ ! -d "node_modules" ] && mkdir node_modules && chmod -R 777 node_modules

yarn
npm run generate
./node_modules/.bin/gulp deploy