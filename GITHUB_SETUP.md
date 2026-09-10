# GitHub Setup Guide for EarthGPT

This guide walks you through setting up GitHub Pages and CI/CD for the EarthGPT project.

## Repository Information

- **Repository URL**: https://github.com/Rintu-chowdory/earthgpt
- **Current Status**: Code pushed and ready for configuration

## Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/Rintu-chowdory/earthgpt
2. Click on **Settings** (gear icon in the top right)
3. In the left sidebar, click on **Pages**
4. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main` and `/root` folder
   - Click **Save**

Your site will be published at: `https://rintu-chowdory.github.io/earthgpt/`

## Step 2: Set Up GitHub Actions (Manual)

Since the GitHub App doesn't have workflow permissions, you can set up CI/CD manually:

### Option A: Enable via GitHub UI
1. Go to **Actions** tab in your repository
2. Click **New workflow**
3. Choose "set up a workflow yourself"
4. Copy the workflow content from below

### Option B: Grant Workflow Permissions
1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"
4. Click **Save**

Then push the workflow files:
```bash
git add .github/workflows/
git commit -m "Add GitHub Actions workflows"
git push origin main
```

## Step 3: Configure Secrets for CI/CD

If you set up GitHub Actions, add these secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each:

```
VITE_APP_ID=your_app_id
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your_jwt_secret
OAUTH_SERVER_URL=https://api.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_backend_key
```

## Step 4: Configure Branch Protection (Optional)

1. Go to **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Set branch name to `main`
4. Enable:
   - ✓ Require a pull request before merging
   - ✓ Require status checks to pass before merging
   - ✓ Require branches to be up to date before merging
5. Click **Create**

## Step 5: Set Up Custom Domain (Optional)

To use a custom domain (e.g., earthgpt.com):

1. Go to **Settings** → **Pages**
2. Under "Custom domain", enter your domain
3. Click **Save**
4. Update your domain's DNS settings:
   - Add CNAME record pointing to `rintu-chowdory.github.io`
   - Or add A records pointing to GitHub's IP addresses:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

## Workflow Files

The following workflow files are ready to use in `.github/workflows/`:

### build.yml
Runs on every push and pull request:
- Installs dependencies
- Type checking
- Builds the project

### ci.yml
Full CI/CD pipeline with deployment:
- Testing
- Building
- Deploying to GitHub Pages

### lint.yml
Code quality checks:
- Prettier formatting
- Type checking

## Deployment Process

Once configured, the deployment process is:

1. **Push to main** → GitHub Actions triggers
2. **Build & Test** → Runs automated tests
3. **Deploy** → Pushes to `gh-pages` branch
4. **Live** → Site updates at `https://rintu-chowdory.github.io/earthgpt/`

## Monitoring Deployments

1. Go to **Actions** tab
2. View workflow runs and logs
3. Check deployment status for each commit

## Troubleshooting

### Build Fails
- Check GitHub Actions logs for error details
- Ensure all environment secrets are set correctly
- Verify dependencies are installed: `pnpm install`

### Pages Not Updating
- Check the `gh-pages` branch exists
- Verify GitHub Pages source is set to `gh-pages` branch
- Clear browser cache and refresh

### Workflow Permission Errors
- Go to **Settings** → **Actions** → **General**
- Enable "Read and write permissions"
- Re-run the failed workflow

## Local Development

To test builds locally:

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# The dist/ folder contains the production build
```

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## Support

For issues or questions:
1. Check GitHub Actions logs
2. Review this guide
3. Open an issue on the repository
