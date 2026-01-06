# Development Workflow - Branch Per Task

## Overview
Each task group from `AGENT_TASKS.md` must be completed on a **separate branch** with its own commit and pull request. This ensures:
- Clean, reviewable changes
- Easy rollback if needed
- Clear history of what was done
- Better collaboration

## Workflow Steps

### 1. Before Starting a Task Group

```bash
# Ensure you're on master/main and up to date
git checkout master
git pull origin master

# Create a new branch for the task group
git checkout -b task-group-[number]-[short-description]

# Example:
git checkout -b task-group-1-core-animation-setup
```

### 2. Complete the Task Group

- Work on all tasks in the group
- Test that everything works (`npm run build`, `npm run dev`)
- Ensure no TypeScript errors
- Follow all `.cursorrules` guidelines

### 3. Commit the Changes

```bash
# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "feat: Task Group [Number] - [Description]

- [List key changes]
- [What was implemented]
- [Any important notes]"

# Example:
git commit -m "feat: Task Group 1 - Core Animation Setup

- Install Framer Motion
- Create animation utilities (lib/animations.ts)
- Create AnimatedSection component
- Create useScrollAnimation hook
- Update globals.css with animation utilities"
```

### 4. Push Branch and Create Pull Request

```bash
# Push the branch to remote
git push -u origin task-group-[number]-[short-description]

# Then create PR via GitHub CLI (if installed) or GitHub web interface
gh pr create --title "Task Group [Number]: [Description]" --body "[Description of changes]"
```

### 5. After PR is Merged

```bash
# Switch back to master
git checkout master

# Pull latest changes
git pull origin master

# Delete local branch (optional)
git branch -d task-group-[number]-[short-description]
```

## Branch Naming Convention

Format: `task-group-[number]-[kebab-case-description]`

Examples:
- `task-group-1-core-animation-setup`
- `task-group-2-navigation-enhancement`
- `task-group-3-hero-section`
- `task-group-7-mouse-interaction-system`

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: Task Group [Number] - [Short Description]

[Detailed description of what was done]
- [Bullet point of key change]
- [Another key change]
```

Types:
- `feat`: New feature (most task groups)
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation only
- `style`: Formatting, styling
- `perf`: Performance improvement

## Pull Request Template

When creating a PR, include:

```markdown
## Task Group [Number]: [Description]

### Changes
- [List major changes]

### Testing
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] Tested locally (`npm run dev`)
- [ ] All acceptance criteria met

### Related
- Closes #[issue-number] (if applicable)
- Related to: [other PRs or issues]
```

## Automation Script

See `scripts/create-task-branch.sh` for an automated script to create branches.

## Important Rules

1. **NEVER commit directly to master/main** - Always use a branch
2. **One task group = One branch = One PR**
3. **Wait for PR approval** before starting next task group (if dependencies exist)
4. **Keep branches focused** - Only include changes for that specific task group
5. **Test before committing** - Ensure build succeeds and no errors

## Current Status

Track which branches exist and their status:

- [ ] `task-group-1-core-animation-setup`
- [ ] `task-group-2-navigation-enhancement`
- [ ] `task-group-3-hero-section`
- [ ] `task-group-4-about-section`
- [ ] `task-group-5-projects-section`
- [ ] `task-group-6-contact-section`
- [ ] `task-group-7-mouse-interaction-system`
- [ ] `task-group-8-page-conversion`
- [ ] `task-group-9-polish-optimization`

