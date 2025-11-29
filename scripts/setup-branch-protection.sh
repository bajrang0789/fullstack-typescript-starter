#!/bin/bash

# Branch Protection Setup Script
# This script configures branch protection rules for the main branch

REPO_OWNER="bajrang0789"
REPO_NAME="fullstack-typescript-starter"
BRANCH="main"

echo "🔒 Setting up branch protection for $REPO_OWNER/$REPO_NAME ($BRANCH branch)..."
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "📥 Install it with: brew install gh"
    echo "🔗 Or visit: https://cli.github.com/manual/installation"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔑 Authenticating with GitHub..."
    gh auth login
fi

echo "✅ GitHub CLI is authenticated"
echo ""

# Enable branch protection
echo "📋 Applying branch protection rules..."

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/$REPO_OWNER/$REPO_NAME/branches/$BRANCH/protection" \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["validate", "lint", "build"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true,
  "block_creations": false
}
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Branch protection successfully configured!"
    echo ""
    echo "📌 Protection rules enabled:"
    echo "   ✓ Require pull request reviews (1 approval)"
    echo "   ✓ Dismiss stale reviews on new commits"
    echo "   ✓ Require review from code owners"
    echo "   ✓ Require status checks: validate, lint, build"
    echo "   ✓ Require branches to be up to date"
    echo "   ✓ Require conversation resolution"
    echo "   ✓ Require linear history (squash/rebase)"
    echo "   ✓ Include administrators"
    echo "   ✓ Restrict force pushes"
    echo "   ✓ Restrict deletions"
    echo ""
    echo "🌐 View settings at:"
    echo "   https://github.com/$REPO_OWNER/$REPO_NAME/settings/branches"
else
    echo ""
    echo "❌ Failed to set up branch protection"
    echo "⚠️  You may need to set it up manually at:"
    echo "   https://github.com/$REPO_OWNER/$REPO_NAME/settings/branches"
    exit 1
fi

echo ""
echo "🎉 Setup complete! The main branch is now protected."
echo ""
echo "📝 Next steps:"
echo "   1. Create a new branch: git checkout -b feature/your-feature"
echo "   2. Make your changes and commit"
echo "   3. Push: git push origin feature/your-feature"
echo "   4. Open a PR on GitHub"
echo "   5. Get approval and merge via PR"
echo ""
echo "⚠️  Direct pushes to main are now blocked!"
