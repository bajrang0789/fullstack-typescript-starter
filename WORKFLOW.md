# Development Workflow Guide

## Quick Reference for Feature Development

### 1. Starting New Work

```bash
# Always start from latest main
git checkout main
git pull origin main

# Create a feature branch (follow naming convention)
git checkout -b feature/your-feature-name

# Valid prefixes: feature/, fix/, hotfix/, chore/, docs/, test/, refactor/
```

### 2. Making Changes

```bash
# Make your changes
# ...

# Stage and commit (use conventional commits)
git add .
git commit -m "feat(scope): add amazing feature"

# Valid types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
```

### 3. Pushing and Creating PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub
# Title must follow: type(scope): description
# Example: "feat(auth): add JWT token refresh"
```

### 4. PR Checks (Automated)

Your PR will automatically run:
- ✅ Branch naming validation
- ✅ PR title format check (conventional commits)
- ✅ Tests
- ✅ Lint checks
- ✅ Merge conflict detection
- ✅ Large file detection
- ✅ Secret scanning
- ✅ Auto-labeling

### 5. After PR is Merged

```bash
# Your branch will be automatically deleted
# Switch back to main
git checkout main
git pull origin main

# Your local feature branch can be deleted
git branch -d feature/your-feature-name
```

## Branch Naming Convention

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feature/` | New features | `feature/user-auth` |
| `fix/` | Bug fixes | `fix/login-error` |
| `hotfix/` | Critical production fixes | `hotfix/security-patch` |
| `chore/` | Maintenance tasks | `chore/update-deps` |
| `docs/` | Documentation only | `docs/api-guide` |
| `test/` | Test changes | `test/unit-tests` |
| `refactor/` | Code refactoring | `refactor/clean-code` |

## Commit Message Convention

Format: `type(scope): description`

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add OAuth support` |
| `fix` | Bug fix | `fix(api): resolve CORS issues` |
| `docs` | Documentation | `docs(readme): update setup guide` |
| `style` | Formatting | `style(ui): fix button alignment` |
| `refactor` | Code restructuring | `refactor(db): optimize queries` |
| `test` | Adding tests | `test(auth): add unit tests` |
| `chore` | Maintenance | `chore(deps): update packages` |
| `perf` | Performance | `perf(api): add caching` |
| `ci` | CI/CD changes | `ci(github): add new workflow` |
| `build` | Build system | `build(docker): update Dockerfile` |
| `revert` | Revert changes | `revert: feat(auth): add OAuth` |

### Scope (Optional)

Indicates what part of the codebase is affected:
- `auth`, `api`, `db`, `ui`, `frontend`, `backend`, etc.

### Description

- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at the end
- Keep under 72 characters

## Example Workflow

```bash
# 1. Start new feature
git checkout main
git pull origin main
git checkout -b feature/password-reset

# 2. Make changes
# ... edit files ...

# 3. Commit with conventional format
git add .
git commit -m "feat(auth): add password reset functionality

- Add forgot password endpoint
- Implement email token generation
- Create reset password form
- Add rate limiting for reset requests

Refs #42"

# 4. Push to remote
git push origin feature/password-reset

# 5. Open PR on GitHub
# Title: "feat(auth): add password reset functionality"
# The PR will automatically:
#   - Validate branch name ✅
#   - Validate PR title ✅
#   - Run tests ✅
#   - Check for conflicts ✅
#   - Add labels ✅

# 6. Get review and merge
# After merge, branch is automatically deleted ✅

# 7. Update local main
git checkout main
git pull origin main
git branch -d feature/password-reset
```

## Automated Branch Cleanup

### Post-Merge Cleanup
- Merged branches are **automatically deleted** after PR merge
- Protected branches (`main`, `develop`) are never deleted

### Weekly Cleanup
- Runs every **Sunday at 2 AM**
- Deletes stale branches older than **30 days**
- Only removes branches with no recent activity

### Manual Cleanup
- Go to: https://github.com/bajrang0789/fullstack-typescript-starter/actions
- Select "Branch Cleanup" workflow
- Click "Run workflow"

## Troubleshooting

### PR Checks Failing

**Branch name invalid:**
```bash
# Rename your branch
git branch -m feature/correct-name
git push origin feature/correct-name
git push origin :old-branch-name
```

**PR title invalid:**
- Edit PR title on GitHub to match format: `type(scope): description`

**Merge conflicts:**
```bash
# Update your branch with latest main
git checkout feature/your-branch
git fetch origin
git rebase origin/main
# Resolve conflicts
git add .
git rebase --continue
git push --force-with-lease origin feature/your-branch
```

### Accidentally Committed to Main

```bash
# If you haven't pushed yet
git reset --soft HEAD~1
git checkout -b feature/your-branch
git commit -m "feat: your commit message"
git push origin feature/your-branch
```

## Tips for Success

1. **Always branch from latest main**
2. **Keep PRs small and focused** (easier to review)
3. **Write descriptive commit messages**
4. **Pull main regularly** to avoid conflicts
5. **Run tests locally** before pushing
6. **Link issues** in commit/PR descriptions (#123)
7. **Request reviews** from code owners
8. **Respond to feedback** promptly

## Branch Protection Status

Currently: **Workflows Active** ✅

Branch protection requires:
- Public repository, OR
- GitHub Pro for private repos

To enable full protection:
1. Make repo public, OR
2. Upgrade to GitHub Pro
3. Run: `./scripts/setup-branch-protection.sh`

Even without branch protection, the automated PR checks enforce:
- ✅ Branch naming
- ✅ Commit format
- ✅ Tests and linting
- ✅ Code review requirements (team discipline)
- ✅ Automated cleanup
