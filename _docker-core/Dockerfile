FROM ubuntu:20.04
COPY installers /installers
WORKDIR /installers
ARG DEBIAN_FRONTEND=noninteractive
RUN ./curl.sh
RUN ./unzip.sh
RUN ./wget.sh
RUN ./aws.sh
RUN ./nodejs.sh
RUN ./ping.sh
RUN ./docker.sh
RUN npm i -g yarn
RUN npm i -g sass
WORKDIR /var/opt