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

### 3. Netlify Deployment (`deploy-netlify.yml`)
- **Triggers**: On push to `main` branch or manual trigger
- **Requirements**:
  - `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
  - `NETLIFY_SITE_ID`: Your Netlify site ID

**Setup Steps:**
1. Go to Netlify dashboard → User settings → Applications → New access token
2. Get your Site ID from Site settings → General → Site details
3. Add secrets to GitHub: Settings → Secrets and variables → Actions

### 4. GitHub Pages Deployment (`deploy-github-pages.yml`)
- **Triggers**: On push to `main` branch or manual trigger
- **Requirements**: 
  - Enable GitHub Pages in repository settings
  - Select "GitHub Actions" as the source

**Setup Steps:**
1. Go to repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. The workflow will automatically deploy on push to `main`

**Note**: If your repository name is not `username.github.io`, you may need to update `vite.config.ts` to set the correct `base` path.

### 5. Generic Deployment (`deploy-generic.yml`)
- **Triggers**: On push to `main` branch or manual trigger
- **Actions**: Builds the project and uploads artifacts
- **Use Case**: For custom deployment scenarios (SSH, S3, etc.)

## Environment Variables

If your application requires environment variables (like Supabase credentials), add them as GitHub Secrets:

1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets with names matching your `.env` file variables (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
3. Update the workflow files to use these secrets in the build step

## Enabling a Workflow

1. Choose the deployment platform you want to use
2. Set up the required secrets (see above)
3. The workflow will automatically run on pushes to `main`
4. You can also manually trigger workflows from the Actions tab

## Disabling Workflows

To disable a workflow you're not using:
- Delete the workflow file, or
- Comment out the workflow in the file, or
- Rename the file to not have `.yml` extension

## Troubleshooting

### Build Failures
- Check that all environment variables are set as GitHub Secrets
- Verify Node.js version compatibility
- Check build logs in the Actions tab

### Deployment Failures
- Verify all required secrets are correctly set
- Check deployment platform status
- Review deployment logs for specific errors

