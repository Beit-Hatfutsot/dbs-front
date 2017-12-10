#!/usr/bin/env bash

OPENSSL_CMD="openssl aes-256-cbc -K $encrypted_6dcdd37ad8d6_key -iv $encrypted_6dcdd37ad8d6_iv -in secret-mojp-k8s-ops.json.enc -out k8s-ops-secret.json -d"

K8S_OPS_REPO_SLUG=Beit-Hatfutsot/mojp-k8s
K8S_OPS_REPO_DIRECTORY=mojp-k8s
K8S_OPS_DOCKER_IMAGE=orihoch/mojp-k8s
K8S_OPS_ENVIRONMENT=production

SIMPLE_APP_DEPLOYMENT_NAME="front"
SIMPLE_APP_DEPLOYMENT_IMAGE="gcr.io/bh-org-01/mojp-dbs-front"
SIMPLE_APP_CONTAINER_NAME="front"
DEPLOYMENT_SCRIPT="
   ./update_yaml.py '{"'"'"${SIMPLE_APP_DEPLOYMENT_NAME}"'"'":{"'"'"image"'"'":"'"'"${SIMPLE_APP_DEPLOYMENT_IMAGE}:${TRAVIS_COMMIT}"'"'"}}' \
                     values.${K8S_OPS_ENVIRONMENT}.auto-updated.yaml &&\
    git config user.email deployment-bot'@'k8s-ops &&\
    git config user.name deployment-bot &&\
    git add values.${K8S_OPS_ENVIRONMENT}.auto-updated.yaml &&\
    git commit -m '${SIMPLE_APP_DEPLOYMENT_NAME} image update --no-deploy' &&\
    git push https://${K8S_OPS_GITHUB_REPO_TOKEN}'@'github.com/${K8S_OPS_REPO_SLUG}.git master &&\
    kubectl set image deployment/${SIMPLE_APP_DEPLOYMENT_NAME} ${SIMPLE_APP_CONTAINER_NAME}=${SIMPLE_APP_DEPLOYMENT_IMAGE}:$TRAVIS_COMMIT &&\
    kubectl rollout status deployment "${SIMPLE_APP_DEPLOYMENT_NAME}"
"

# preflight checks - we don't fail on any of there, just skip the deployment
[ "${TRAVIS_COMMIT}" == "" ] &&\
     echo "missing commit from travis - skipping deployment" && exit 0
[ "${TRAVIS_COMMIT_MESSAGE}" == "" ] &&\
     echo "missing commit message from travis - skipping deployment" && exit 0
[ "${K8S_CONTINUOUS_DEPLOYMENT}" != "true" ] &&\
     echo "K8S_CONTINUOUS_DEPLOYMENT is not true - skipping deployment" && exit 0
[ "${TRAVIS_PULL_REQUEST}" != "false" ] &&\
     echo "TRAVIS_PULL_REQUEST is not false - skipping deployment" && exit 0
[ "${TRAVIS_BRANCH}" != "master" ] &&\
     echo "TRAVIS_BRANCH is not master - skipping deployment" && exit 0
echo "${TRAVIS_COMMIT_MESSAGE}" | grep -- --no-deploy >/dev/null &&\
     echo "--no-deploy commit flag is set - skipping deployment" && exit 0

# decrypt the service account secret json
! $OPENSSL_CMD &&\
    echo "failed to decrypt service account secret" && exit 1

if [ "${K8S_OPS_REPO_SLUG}" == "${TRAVIS_REPO_SLUG}" ]; then
    echo "skipping cloning of ops repo as this is the current repo (as reported by TRAVIS_REPO_SLUG)"
    K8S_OPS_REPO_DIRECTORY="./"
else
    # clone the k8s repo as a subdirectory of the current project's repo
    ! git clone --depth 1 "https://github.com/${K8S_OPS_REPO_SLUG}.git" "${K8S_OPS_REPO_DIRECTORY}" &&\
        echo "failed to clone k8s repo" && exit 1
fi

! docker pull "${K8S_OPS_DOCKER_IMAGE}" &&\
    echo "failed to pull docker image" && exit 1

! docker run -it -v "`pwd`/k8s-ops-secret.json:/k8s-ops/secret.json" \
                 -v "`pwd`/${K8S_OPS_REPO_DIRECTORY}:/ops" \
                 "${K8S_OPS_DOCKER_IMAGE}" \
                 -c "source ~/.bashrc && source switch_environment.sh ${K8S_OPS_ENVIRONMENT};
                     ${DEPLOYMENT_SCRIPT}" &&\
    echo "failed to run DEPLOYMENT_SCRIPT: ${DEPLOYMENT_SCRIPT}" && exit 1

exit 0
