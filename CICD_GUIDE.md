# CI/CD Pipeline Guide

## Overview

Hệ thống HRM sử dụng **GitHub Actions** cho CI/CD pipeline với các stage sau:

1. **Code Quality** - Linting và code standards
2. **Database Validation** - Kiểm tra schema
3. **Backend Tests** - PHP API tests
4. **Frontend Tests** - JavaScript tests
5. **Security Scan** - Vulnerability scanning
6. **Build & Package** - Tạo deployment package
7. **Deploy Staging** - Deploy tự động (branch develop)
8. **Deploy Production** - Deploy với approval (branch main)
9. **Performance Testing** - Load testing
10. **Notifications** - Thông báo kết quả

## Pipeline Workflows

### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Trigger:**
- Push to `main` hoặc `develop` branch
- Pull request to `main` hoặc `develop`

**Jobs:**

#### Code Quality & Linting
```bash
# JavaScript Linting
npx eslint public/assets/js/**/*.js

# PHP Linting
vendor/bin/phpcs --standard=PSR12 app/ public/api.php
```

#### Database Validation
- Khởi động MySQL 8.0 container
- Import schema từ `database/migrations/001_initial_schema.sql`
- Validate tables và data

#### Backend Tests
- Setup PHP 8.4 + MySQL
- Run PHPUnit tests
- Generate coverage report

#### Frontend Tests
- Setup Node.js 20
- Run Jest tests
- Generate coverage report

#### Security Scan
- Trivy vulnerability scanner
- SQL injection detection
- Hardcoded credentials check

#### Build & Package
- Tạo deployment package
- Create `.env.example`
- Generate deployment instructions
- Upload artifact (30 days retention)

#### Deploy Staging (Auto)
- Download build artifact
- Deploy to staging server
- Run database migrations
- Health check

#### Deploy Production (Manual Approval)
- Require manual approval
- Backup production database
- Deploy to production
- Run migrations
- Health check
- Send notifications

### 2. Code Review Workflow (`.github/workflows/code-review.yml`)

**Trigger:** Pull Requests

**Actions:**
- Automated code review với reviewdog
- Check for TODO/FIXME comments
- Check for large files
- Check for sensitive data (passwords, API keys)
- Comment on PR với review results

### 3. Dependency Updates (`.github/workflows/dependency-update.yml`)

**Trigger:**
- Schedule: Every Monday 9 AM UTC
- Manual trigger

**Actions:**
- Check outdated PHP packages
- Check outdated JavaScript packages
- Security audit với composer/npm

## Setup Instructions

### 1. GitHub Repository Setup

```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial commit with CI/CD pipeline"

# Add remote repository
git remote add origin https://github.com/yourusername/HRM.git
git branch -M main
git push -u origin main
```

### 2. GitHub Secrets Configuration

Vào **Settings → Secrets and variables → Actions** và thêm:

**Required Secrets:**
- `STAGING_SSH_KEY` - SSH private key cho staging server
- `STAGING_HOST` - Staging server hostname
- `STAGING_USER` - Staging server username
- `STAGING_PATH` - Path to deployment directory

- `PROD_SSH_KEY` - SSH private key cho production server
- `PROD_HOST` - Production server hostname
- `PROD_USER` - Production server username
- `PROD_PATH` - Path to deployment directory

- `DB_PASSWORD` - Database password

**Optional Secrets:**
- `SLACK_WEBHOOK` - Slack webhook for notifications
- `DISCORD_WEBHOOK` - Discord webhook for notifications

### 3. Branch Protection Rules

Vào **Settings → Branches** và configure:

**For `main` branch:**
- ✅ Require pull request before merging
- ✅ Require approvals (1-2 reviewers)
- ✅ Require status checks to pass
  - code-quality
  - database-validation
  - backend-tests
  - frontend-tests
  - security-scan
- ✅ Require branches to be up to date
- ✅ Include administrators

**For `develop` branch:**
- ✅ Require pull request before merging
- ✅ Require status checks to pass

### 4. Environments Setup

Vào **Settings → Environments** và tạo:

**Staging Environment:**
- Name: `staging`
- URL: `https://hrm-staging.example.com`
- Protection rules: None (auto-deploy)

**Production Environment:**
- Name: `production`
- URL: `https://hrm.example.com`
- Protection rules:
  - ✅ Required reviewers (2 reviewers)
  - ✅ Wait timer: 5 minutes

## Local Development

### Install Dependencies

```bash
# PHP dependencies
composer install

# JavaScript dependencies
npm install
```

### Run Tests Locally

```bash
# PHP tests
make test
# or
vendor/bin/phpunit

# JavaScript tests
npm test

# All tests
make test
```

### Run Linters Locally

```bash
# Lint code
make lint

# Fix code style
make fix
```

### Build Package Locally

```bash
make build
```

## Deployment Process

### Deploy to Staging

1. Create feature branch:
```bash
git checkout -b feature/my-feature
```

2. Make changes và commit:
```bash
git add .
git commit -m "Add new feature"
```

3. Push và create PR to `develop`:
```bash
git push origin feature/my-feature
```

4. CI/CD pipeline runs automatically
5. Merge PR → Auto-deploy to staging

### Deploy to Production

1. Create PR from `develop` to `main`
2. CI/CD pipeline runs
3. Code review và approval
4. Merge PR
5. Manual approval required in GitHub Actions
6. Auto-deploy to production sau approval

## Monitoring & Notifications

### Pipeline Status

View pipeline status tại:
- **Actions tab** trong GitHub repository
- **Commits page** - check mark/cross icon
- **Pull Requests** - CI/CD status checks

### Artifacts

Download deployment packages:
1. Go to **Actions tab**
2. Click on workflow run
3. Scroll to **Artifacts** section
4. Download `hrm-deployment-package`

### Logs

View detailed logs:
1. Click on workflow run
2. Click on job name
3. Expand steps to see logs

## Troubleshooting

### Pipeline Fails

**Common Issues:**

1. **Linting errors:**
```bash
# Fix locally
make fix
git add .
git commit -m "Fix linting errors"
git push
```

2. **Tests fail:**
```bash
# Run tests locally
make test
# Fix issues
git add .
git commit -m "Fix failing tests"
git push
```

3. **Database migration fails:**
- Check SQL syntax in migration file
- Test migration locally:
```bash
make db-setup
```

4. **Build fails:**
- Check file permissions
- Verify directory structure
- Check for missing files

### Deployment Issues

**Staging deployment fails:**
- Check SSH keys configuration
- Verify server credentials
- Check server disk space
- Review server logs

**Production deployment fails:**
- Same as staging
- Check manual approval status
- Verify database backup completed

### Security Scan Issues

**False positives:**
- Review security scan results
- Add exceptions in `.trivyignore` if needed
- Update vulnerable dependencies

## Best Practices

### 1. Commit Messages

Follow conventional commits:
```
feat: Add employee export feature
fix: Fix salary calculation bug
docs: Update README
test: Add tests for auth module
refactor: Improve code structure
chore: Update dependencies
```

### 2. Pull Requests

- Write descriptive PR titles
- Fill out PR template completely
- Link related issues
- Add screenshots for UI changes
- Request reviews from team members

### 3. Testing

- Write tests before pushing
- Maintain >80% code coverage
- Test edge cases
- Test on different browsers

### 4. Database Migrations

- Always create backup before migration
- Test migrations in staging first
- Write rollback scripts
- Document schema changes

### 5. Security

- Never commit credentials
- Use environment variables
- Regular security audits
- Keep dependencies updated

## Continuous Improvement

### Metrics to Track

- Pipeline success rate
- Average build time
- Test coverage
- Deployment frequency
- Mean time to recovery (MTTR)
- Change failure rate

### Optimization Tips

1. **Cache dependencies:**
   - Enable caching for npm/composer
   - Cache Docker layers

2. **Parallel jobs:**
   - Run independent tests in parallel
   - Split large test suites

3. **Fail fast:**
   - Run quick checks first
   - Stop pipeline on critical failures

4. **Optimize Docker images:**
   - Use smaller base images
   - Multi-stage builds

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Composer Documentation](https://getcomposer.org/doc/)
- [npm Documentation](https://docs.npmjs.com/)

## Support

For CI/CD issues:
1. Check this guide first
2. Review pipeline logs
3. Search existing issues
4. Create new issue with:
   - Pipeline run URL
   - Error messages
   - Steps to reproduce

---

**Last Updated:** November 2025
**Pipeline Version:** 1.0.0
