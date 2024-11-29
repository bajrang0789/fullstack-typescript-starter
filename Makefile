.PHONY: help install dev build test lint clean docker-build docker-run deploy

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm ci

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

test: ## Run tests
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

lint: ## Run linter
	npm run lint

lint-fix: ## Fix linting issues
	npm run lint:fix

clean: ## Clean build artifacts
	rm -rf node_modules dist coverage .next

docker-build: ## Build Docker image
	docker build -t professional-project:latest .

docker-run: ## Run Docker container
	docker-compose up -d

docker-stop: ## Stop Docker containers
	docker-compose down

deploy-staging: ## Deploy to staging
	./scripts/deploy.sh staging

deploy-production: ## Deploy to production
	./scripts/deploy.sh production

db-migrate: ## Run database migrations
	npx prisma migrate deploy

db-seed: ## Seed database
	npm run db:seed

logs: ## View application logs
	docker-compose logs -f
