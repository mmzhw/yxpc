#!bin/sh
git pull
yarn build:dev
pm2 delete pc
yarn start:test