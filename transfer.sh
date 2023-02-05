#!/usr/bin/env bash

set -e

# A script to copy the module into a Foundry data directory.

if [[ $# -eq 0 ]]; then
    echo "No arguments provided. Usage: ./transfer.sh <path_to_user_Data_dir>"
    exit 1
fi

echo "Building..."
npm run build

echo "Removing existing module..."
rm -rf "${1}/modules/dice-so-nice-more-sfx-triggers"

echo "Transferring..."
cp -r "dist/dice-so-nice-more-sfx-triggers" "${1}/modules/"
echo "Done!"
