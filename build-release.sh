#!/bin/bash
set -eu 

dir=$(mktemp -d)
pushd $dir

git -c http.sslVerify=false clone https://git.test.services.local/dt_ct_ioda/BB-8.git
cd BB-8

npm install
npm run build

popd

tar czf bb8-$(date +%Y%m%d-%H%M%S).tgz -C $dir/BB-8/dist .

rm -rf "$dir"

