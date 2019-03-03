#!/bin/bash

if [[ $(git log -1 --pretty=format:'%an') != *"[bot]"* ]]; then
    echo "Authenticate with registry"
    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc

    echo "Publish package"
    $(npm publish)

    echo "Publish coverage files to Codecov"
    $(./node_modules/.bin/codecov)
fi