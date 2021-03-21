# umt-web

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# Run developer docker

This section is for running development in a container environment.
This instace was tested on **Windows 10** in **Git Bash** shell.

```bash
# Set up AWS environment access keys
export AWS_ACCESS_KEY_ID=********
export AWS_SECRET_ACCESS_KEY=********
export AWS_DEFAULT_REGION=********

# Run docker-compose for dev
./docker-compose up dev-executor
```

Now you can go to [http://localhost:3000](http://localhost:3000)

# Run deploy docker

This section is for running deployment to AWS in a container environment.
This instace was tested on **Windows 10** in **Git Bash** shell.

```bash
# Set up AWS environment access keys
export AWS_ACCESS_KEY_ID=********
export AWS_SECRET_ACCESS_KEY=********
export AWS_DEFAULT_REGION=********

# Run docker-compose for deploy
./docker-compose up deploy-executor
```
