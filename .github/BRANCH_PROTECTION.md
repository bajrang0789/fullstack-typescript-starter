# Branch Protection Setup

This document describes the branch protection rules that should be configured for this repository.

## Main Branch Protection

The `main` branch should have the following protection rules enabled:

### Required Settings

1. **Require pull request reviews before merging**
   - Required approving reviews: 1
   - Dismiss stale pull request approvals when new commits are pushed: ✅
   - Require review from Code Owners: ✅

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging: ✅
   - Required status checks:
     - `validate` (from pr-checks.yml)
     - `lint` (from pr-checks.yml)
     - `build` (from ci.yml)

3. **Require conversation resolution before merging**: ✅

4. **Require signed commits**: ⚠️ (Optional but recommended)

5. **Require linear history**: ✅ (Enforces rebase/squash merging)

6. **Include administrators**: ✅ (Apply rules to admins too)

7. **Restrict who can push to matching branches**: ✅
   - Only allow merge via pull requests
   - No direct pushes to main

8. **Allow force pushes**: ❌ (Disabled)

9. **Allow deletions**: ❌ (Disabled)

## Automated Setup via GitHub CLI

You can configure these settings using the GitHub CLI:

```bash
# Install GitHub CLI if not already installed
# brew install gh (macOS)
# See: https://cli.github.com/manual/installation

# Authenticate
gh auth login

# Enable branch protection for main
gh api repos/bajrang0789/fullstack-typescript-starter/branches/main/protection \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks='{"strict":true,"contexts":["validate","lint","build"]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' \
  -f restrictions=null \
  -f required_linear_history=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false \
  -f required_conversation_resolution=true
```

## Manual Setup via GitHub Web UI

1. Go to: https://github.com/bajrang0789/fullstack-typescript-starter/settings/branches
2. Click "Add branch protection rule"
3. Enter branch name pattern: `main`
4. Enable the settings listed above
5. Click "Create" to save

## Branch Naming Convention

All feature branches must follow this naming convention:

- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Critical production fixes
- `chore/*` - Maintenance tasks
- `docs/*` - Documentation updates
- `test/*` - Test additions/updates
- `refactor/*` - Code refactoring

Examples:
- `feature/user-authentication`
- `fix/login-error`
- `docs/update-readme`
- `refactor/database-layer`

## PR Title Convention

All pull request titles must follow Conventional Commits format:

```
type(scope): description

Examples:
- feat(auth): add JWT token refresh
- fix(api): resolve CORS issues
- docs(readme): update installation steps
- chore(deps): update dependencies
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

## Automated Branch Cleanup

The repository includes automated branch cleanup:

1. **After PR merge**: Automatically deletes the merged branch
2. **Weekly cleanup**: Removes stale branches (>30 days old) every Sunday
3. **Manual cleanup**: Can be triggered via GitHub Actions workflow dispatch

Protected branches (`main`, `develop`) are never deleted.
