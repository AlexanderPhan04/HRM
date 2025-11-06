# HRM System Makefile
# Make commands for development and deployment

.PHONY: help install test lint deploy clean

# Default target
help:
	@echo "HRM System - Available Commands:"
	@echo "  make install       - Install dependencies"
	@echo "  make test          - Run all tests"
	@echo "  make lint          - Run code linters"
	@echo "  make fix           - Fix code style issues"
	@echo "  make build         - Build production package"
	@echo "  make deploy-stage  - Deploy to staging"
	@echo "  make deploy-prod   - Deploy to production"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make db-setup      - Setup database"
	@echo "  make db-backup     - Backup database"

# Install dependencies
install:
	@echo "Installing PHP dependencies..."
	composer install
	@echo "Installing JavaScript dependencies..."
	npm install
	@echo "✅ Dependencies installed"

# Run tests
test:
	@echo "Running PHP tests..."
	vendor/bin/phpunit
	@echo "Running JavaScript tests..."
	npm test
	@echo "✅ All tests passed"

# Run linters
lint:
	@echo "Linting PHP code..."
	vendor/bin/phpcs --standard=PSR12 app/ public/api.php
	@echo "Linting JavaScript code..."
	npm run lint
	@echo "✅ Code linting complete"

# Fix code style
fix:
	@echo "Fixing PHP code style..."
	vendor/bin/phpcbf --standard=PSR12 app/ public/api.php
	@echo "Fixing JavaScript code style..."
	npm run lint:fix
	npm run format
	@echo "✅ Code style fixed"

# Build production package
build:
	@echo "Building production package..."
	mkdir -p dist
	cp -r public dist/
	cp -r app dist/
	cp -r database dist/
	cp README.md dist/
	tar -czf hrm-system-prod.tar.gz -C dist .
	@echo "✅ Build complete: hrm-system-prod.tar.gz"

# Deploy to staging
deploy-stage:
	@echo "Deploying to staging environment..."
	@echo "⚠️  This is a placeholder - configure your staging server"
	# scp hrm-system-prod.tar.gz user@staging.example.com:/var/www/
	# ssh user@staging.example.com 'cd /var/www && tar -xzf hrm-system-prod.tar.gz'

# Deploy to production
deploy-prod:
	@echo "⚠️  WARNING: Deploying to PRODUCTION"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "Deploying to production..."; \
		echo "Configure your production deployment here"; \
	fi

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf vendor/
	rm -rf node_modules/
	rm -rf coverage/
	rm -f *.tar.gz
	@echo "✅ Clean complete"

# Setup database
db-setup:
	@echo "Setting up database..."
	mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hrm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
	mysql -u root -p hrm_system < database/migrations/001_initial_schema.sql
	@echo "✅ Database setup complete"

# Backup database
db-backup:
	@echo "Backing up database..."
	mkdir -p backups
	mysqldump -u root -p hrm_system > backups/hrm_backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backup complete"

# Development server (if using PHP built-in server)
serve:
	@echo "Starting development server..."
	php -S localhost:8000 -t public/
