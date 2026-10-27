#!/bin/bash
cd "$(dirname "$0")"
EXPO_TOKEN="$EXPO_TOKEN" npx eas-cli build --profile preview --platform android --non-interactive
