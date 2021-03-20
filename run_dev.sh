#!/bin/bash

# Only for dev
export AWS_DEFAULT_REGION=us-east-1

chmod +x env.sh; source ./env.sh

# Only for dev
export NUXT_ENV_ROOT_URL=http://localhost:3000

# Npm install if not already
[ ! -d "node_modules" ] && yarn

# Start sass
sass --watch ./assets/styles/app.scss:./assets/styles/app.css \
    --cache-location ./assets/styles/.sass-cache &

# Start nuxt
nuxt