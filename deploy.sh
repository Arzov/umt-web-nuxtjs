#!/bin/bash
# ==========================================================
# Deploy to AWS
# @author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# ----------------------------------------------------------
#  Load environment variables
# ----------------------------------------------------------

chmod +x env.sh; source ./env.sh


# ----------------------------------------------------------
#  Nuxt deploy
# ----------------------------------------------------------

export AWS_BUCKET_NAME="$AWS_S3_WEB_BUCKET"
export AWS_CLOUDFRONT="$AWS_CLOUDFRONT_ID"

# Load nvm (node version manager), install node (version in .nvmrc), and npm install packages
[ -s "$HOME/.nvm/nvm.sh" ] && source "$HOME/.nvm/nvm.sh" && nvm use
# Npm install if not already.
[ ! -d "node_modules" ] && npm install && npm install gulp

npm run generate
./node_modules/.bin/gulp deploy