#!/bin/bash

VERSION=$(cat VERSION | sed 's/[[:alpha:]|(|[:space:]]//g')
DATE=$(date +"%Y-%m-%d")

chmod u+x ./semver

VERSION=$(./semver bump $1 "$VERSION")

# Update CHANGELOG

CHANGELOG=$(tail -n +3 CHANGELOG.md)

CHANGELOG="# Changelog

## [${VERSION}] - ${DATE}

- 

${CHANGELOG}
"

echo "$CHANGELOG" > CHANGELOG.md

# Update VERSION file

echo "$VERSION" > VERSION

echo $VERSION $1 $DATE