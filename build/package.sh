#!/usr/bin/env bash

set -e

rm -rf dist/dice-so-nice-more-sfx-triggers
mkdir -p dist/dice-so-nice-more-sfx-triggers
cp -r module/* dist/dice-so-nice-more-sfx-triggers
node build/package--manifest.js
