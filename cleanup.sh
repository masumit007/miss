#!/bin/bash
# Cleanup script for miss-platform
# Removes build artifacts and OS junk from disk AND from git tracking,
# then makes sure .gitignore keeps them out for good.
# Does NOT touch anything under src/, package.json, or config files.

set -e

echo "== Removing build artifacts and OS junk from disk =="
rm -rf dist
rm -f tsconfig.tsbuildinfo
find . -name ".DS_Store" -not -path "./node_modules/*" -delete

echo "== Untracking them from git (if they were tracked) =="
git rm -r --cached dist 2>/dev/null || true
git rm --cached tsconfig.tsbuildinfo 2>/dev/null || true
git rm --cached .DS_Store 2>/dev/null || true
find . -name ".DS_Store" -not -path "./node_modules/*" -print0 2>/dev/null | xargs -0 -I{} git rm --cached "{}" 2>/dev/null || true

echo "== Updating .gitignore =="
touch .gitignore
for entry in "dist/" "node_modules/" ".DS_Store" "tsconfig.tsbuildinfo" ".env" ".env.production" ".env.local"; do
  if ! grep -qxF "$entry" .gitignore; then
    echo "$entry" >> .gitignore
  fi
done

echo "== Done. Review before committing: =="
git status
