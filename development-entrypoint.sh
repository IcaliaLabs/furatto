#! /bin/bash

bundle

mkdir /tmp/node_modules
ln -sf /tmp/node_modules node_modules

apt-get update && \
apt-get -y install nodejs \
nodejs-legacy \
npm

npm install -g bower
npm install -g grunt-cli
npm install

grunt

exec "$@"
