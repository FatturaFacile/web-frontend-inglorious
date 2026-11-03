#!/bin/sh
# Server side of .github/workflows/deploy.yml. Installed on the VPS as ~/fatturafacile-dev/inglorious-deploy.sh
# and set as the forced command of the CI SSH key in ~/.ssh/authorized_keys:
#   command="~/fatturafacile-dev/inglorious-deploy.sh",restrict ssh-ed25519 AAAA... fatturafacile-inglorious-ci
# Reads the build (tar.gz of dist/) from stdin. The site folder is bind-mounted into ffdev_web, so its contents
# are replaced in place (the folder itself must stay).
set -eu
cd ~/fatturafacile-dev

rm -rf inglorious.new
mkdir -p inglorious.new inglorious
tar xzf - -C inglorious.new
[ -f inglorious.new/index.html ] || { echo "index.html missing in the upload"; rm -rf inglorious.new; exit 1; }
find inglorious -mindepth 1 -delete
cp -a inglorious.new/. inglorious/
rm -rf inglorious.new
echo "inglorious deploy OK"
