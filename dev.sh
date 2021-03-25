#!/bin/bash

# Only for dev
export AWS_DEFAULT_REGION=us-east-1

chmod +x env.sh; source ./env.sh

# Only for dev
export NUXT_ENV_ROOT_URL=http://localhost:3000

# Npm install if not already
[ ! -d "node_modules" ] && yarn

# Start sass
sass --watch ./assets/styles/app.scss:./assets/styles/app.css &

# Start nuxt
./node_modules/.bin/nuxt -H 0.0.0.0