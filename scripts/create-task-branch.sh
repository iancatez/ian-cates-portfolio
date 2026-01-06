#!/bin/bash

# Script to create a new branch for a task group
# Usage: ./scripts/create-task-branch.sh [task-group-number] [description]
# Example: ./scripts/create-task-branch.sh 1 "Core Animation Setup"

set -e

TASK_NUMBER=$1
DESCRIPTION=$2

if [ -z "$TASK_NUMBER" ] || [ -z "$DESCRIPTION" ]; then
  echo "Usage: ./scripts/create-task-branch.sh [task-group-number] [description]"
  echo "Example: ./scripts/create-task-branch.sh 1 'Core Animation Setup'"
  exit 1
fi

# Convert description to kebab-case
KEBAB_DESCRIPTION=$(echo "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
BRANCH_NAME="task-group-${TASK_NUMBER}-${KEBAB_DESCRIPTION}"

# Ensure we're on master/main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ] && [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Warning: Not on master/main branch. Current branch: $CURRENT_BRANCH"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Pull latest changes
echo "Pulling latest changes from master..."
git pull origin master 2>/dev/null || git pull origin main 2>/dev/null || echo "No remote branch found, continuing..."

# Create and checkout new branch
echo "Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

echo ""
echo "✅ Branch created: $BRANCH_NAME"
echo ""
echo "Next steps:"
echo "1. Complete the task group work"
echo "2. Test: npm run build"
echo "3. Commit: git add -A && git commit -m 'feat: Task Group $TASK_NUMBER - $DESCRIPTION'"
echo "4. Push: git push -u origin $BRANCH_NAME"
echo "5. Create PR: gh pr create --title 'Task Group $TASK_NUMBER: $DESCRIPTION'"

