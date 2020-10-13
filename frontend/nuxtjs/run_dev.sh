#!/bin/bash

# Solo para desarrollo
export AWS_DEFAULT_REGION=us-east-1

chmod +x env.sh; source ./env.sh

# Solo para desarrollo
export NUXT_ENV_ROOT_URL=http://localhost:3000

# Npm install if not already.
[ ! -d "node_modules" ] && npm install

nuxt