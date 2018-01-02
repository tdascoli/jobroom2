#!/usr/bin/env bash
echo 'publish to Artifactory'
./gradlew bootWar publish -Pprod -Pzipkin -x test --stacktrace
echo 'deployment to DEV'
curl "https://dev.job-room.ch:8443/deploy/jr2?$TRAVIS_REPO_SLUG&$TRAVIS_JOB_ID&$TRAVIS_JOB_NUMBER" --insecure
echo 'deployment was successful'

