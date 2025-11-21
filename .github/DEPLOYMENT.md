# Deployment Guide

This repository includes GitHub Actions workflows for automated CI/CD and deployment.

## Available Workflows

### 1. CI Workflow (`ci.yml`)
- **Triggers**: On push to `main`/`develop` branches and on pull requests
- **Actions**: 
  - Lints the codebase
  - Builds the project
  - Validates build output

### 2. Vercel Deployment (`deploy-vercel.yml`)
- **Triggers**: On push to `main` branch or manual trigger
- **Requirements**:
  - `VERCEL_TOKEN`: Your Vercel authentication token
  - `VERCEL_ORG_ID`: Your Vercel organization ID
  - `VERCEL_PROJECT_ID`: Your Vercel project ID

**Setup Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel link` in your project to link it
3. Get your tokens from Vercel dashboard
4. Add secrets to GitHub: Settings → Secrets and variables → Actions

## Environment Variables

If your application requires environment variables (like Supabase credentials), add them as GitHub Secrets:

1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets with names matching your `.env` file variables (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
3. Update the workflow file to use these secrets in the build step

## Enabling the Workflow

1. Set up the required secrets (see above)
2. The workflow will automatically run on pushes to `main`
3. You can also manually trigger the workflow from the Actions tab

## Troubleshooting

### Build Failures
- Check that all environment variables are set as GitHub Secrets
- Verify Node.js version compatibility
- Check build logs in the Actions tab

### Deployment Failures
- Verify all required secrets are correctly set
- Check Vercel platform status
- Review deployment logs for specific errors

