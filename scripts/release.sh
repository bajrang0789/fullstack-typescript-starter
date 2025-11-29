#!/usr/bin/env zsh
set -euo pipefail

# Usage:
#  scripts/release.sh v0.1.1 [--title "v0.1.1"] [--notes-file CHANGELOG.md]
# Requires: git with upstream set, and GitHub CLI `gh` authenticated.

if [[ $# -lt 1 ]]; then
  echo "Usage: scripts/release.sh <tag> [--title <title>] [--notes-file <file>]"
  exit 1
fi

TAG="$1"
shift

TITLE="$TAG"
NOTES_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title)
      TITLE="$2"; shift 2;;
    --notes-file)
      NOTES_FILE="$2"; shift 2;;
    *)
      echo "Unknown option: $1"; exit 1;;
  esac
done

# Ensure gh is available
if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI 'gh' is not installed or not on PATH."
  exit 1
fi

# Ensure we're on main and up to date
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "Switching to 'main' branch..."
  git checkout main
fi

echo "Pulling latest from origin/main..."
git pull --tags

# Create tag if it doesn't exist
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag $TAG already exists."
else
  echo "Creating annotated tag $TAG..."
  git tag -a "$TAG" -m "Release $TAG"
  git push origin "$TAG"
fi

# Create or edit release
if [[ -n "$NOTES_FILE" ]]; then
  echo "Creating GitHub release $TAG with notes from $NOTES_FILE..."
  gh release create "$TAG" --title "$TITLE" --notes-file "$NOTES_FILE" || gh release edit "$TAG" --title "$TITLE" --notes-file "$NOTES_FILE"
else
  echo "Creating GitHub release $TAG with empty notes..."
  gh release create "$TAG" --title "$TITLE" --notes "" || gh release edit "$TAG" --title "$TITLE" --notes ""
fi

echo "Release $TAG published successfully."