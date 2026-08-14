#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FIXTURE_ROOT="$(mktemp -d)"
trap 'rm -rf "$FIXTURE_ROOT"' EXIT

mkdir -p "$FIXTURE_ROOT/scripts"
cp "$REPO_ROOT/scripts/sync-agent-rules.sh" "$FIXTURE_ROOT/scripts/"
printf '# Fixture instructions\n\n@docs/missing-guide.md\n' > "$FIXTURE_ROOT/AGENTS.md"

set +e
OUTPUT="$(bash "$FIXTURE_ROOT/scripts/sync-agent-rules.sh" 2>&1)"
STATUS=$?
set -e

if [[ $STATUS -eq 0 ]]; then
  echo "Expected sync-agent-rules.sh to reject a missing @file import" >&2
  exit 1
fi

if [[ "$OUTPUT" != *"docs/missing-guide.md"* ]]; then
  echo "Expected the failure to name the missing import" >&2
  exit 1
fi

echo "Missing @file imports fail closed"
