#!/usr/bin/env bash

set -e

if [ "${TRAVIS_BRANCH}" != "master" ] || [ "${K8S_DEPLOYMENT_NAME}" == "" ] || [ "${K8S_IMAGE_NAME}" == "" ]; then
    echo " > skipping deployment: not on master branch, or missing K8S environment variables"
    exit 0
else
    echo " > updating k8s configurations with the new image - which should trigger deployment"
    cd $HOME
    if [ ! -f beit-hatfutsot-devops/README.md ]; then
        rm -rf beit-hatfutsot-devops
        git clone "https://${DEPLOYMENT_BOT_GITHUB_TOKEN}@github.com/Beit-Hatfutsot/beit-hatfutsot-devops.git"
    fi
    cd beit-hatfutsot-devops
    bin/k8s_update_deployment_image.py "${K8S_DEPLOYMENT_NAME}" "${K8S_IMAGE_NAME}:${TRAVIS_COMMIT}"
    git config user.email ori+beit-hatfutsot-deployment-bot@uumpa.com
    git config user.name beit-hatfutsot-deployment-bot
    git add "k8s/${K8S_DEPLOYMENT_NAME}.yaml"
    git commit -m "deployment image update: ${K8S_DEPLOYMENT_NAME}=${TRAVIS_COMMIT}:${TRAVIS_COMMIT}"
    git push "https://${DEPLOYMENT_BOT_GITHUB_TOKEN}@github.com/Beit-Hatfutsot/beit-hatfutsot-devops.git" master
fi
