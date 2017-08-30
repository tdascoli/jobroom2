#!/usr/bin/env bash
echo 'publish to Artifactory'
./gradlew bootWar publish -Pprod -Pgraphite -Pprometheus -x test --stacktrace
echo 'prepare SSH connection'
chmod 600 .travis/ssh_key
ssh-keygen -p -P $SSH_PASS -N '' -f .travis/ssh_key
echo 'deployment to DEV'
ssh -i .travis/ssh_key ubuntu@159.100.254.166 "~/bin/deploy-jobroom.sh $TRAVIS_REPO_SLUG $TRAVIS_JOB_ID $TRAVIS_JOB_NUMBER"
echo 'deployment was successful'

