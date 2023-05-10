#!/bin/bash

VERSION=$(cat VERSION)
DATE=$(date +"%Y-%m-%d")

IFS='.' read -ra VERSION <<< "$VERSION"
MAJOR=${VERSION[0]}
MINOR=${VERSION[1]}
PATCH=${VERSION[2]}

if [ "$1" == "major" ]; then
    let "MAJOR+=1"
    MINOR=0
    PATCH=0
elif [ "$1" == "minor" ]; then
    let "MINOR+=1"
    PATCH=0
elif [ "$1" == "patch" ]; then
    let "PATCH+=1"
fi

VERSION="${MAJOR}.${MINOR}.${PATCH}"

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