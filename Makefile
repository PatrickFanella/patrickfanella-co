SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
API_DIR := $(ROOT_DIR)api
WEB_DIR := $(ROOT_DIR)web
COMPOSE := docker compose
GO ?= go
NPM ?= npm

.PHONY: help init-env install bootstrap status db-up db-down db-reset db-logs migrate seed api web api-test web-lint web-test web-build e2e test verify stack-up stack-down stack-logs

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: make <target>\n\nTargets:\n"} /^[a-zA-Z0-9_.-]+:.*##/ {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

init-env: ## Create .env from .env.example if it is missing
	@if [ -f .env ]; then \
		echo ".env already exists"; \
	else \
		cp .env.example .env; \
		echo "Created .env from .env.example"; \
	fi

install: ## Install frontend dependencies
	cd $(WEB_DIR) && $(NPM) ci

bootstrap: init-env db-up install migrate seed ## Prepare the local development environment
	@echo "Bootstrap complete. Run 'make api' and 'make web' in separate terminals."

status: ## Show Docker Compose service status
	$(COMPOSE) ps

db-up: ## Start PostgreSQL with Docker Compose
	$(COMPOSE) up -d postgres

db-down: ## Stop PostgreSQL
	$(COMPOSE) stop postgres

db-reset: ## Stop Compose services and remove volumes for a clean database reset
	$(COMPOSE) down -v --remove-orphans

db-logs: ## Tail PostgreSQL logs
	$(COMPOSE) logs -f postgres

migrate: init-env ## Apply database migrations
	cd $(API_DIR) && $(GO) run ./cmd/migrate

seed: init-env ## Seed portfolio content into the database
	cd $(API_DIR) && $(GO) run ./cmd/seed

api: init-env ## Run the Go API locally
	cd $(API_DIR) && $(GO) run ./cmd/server

web: ## Run the Vite frontend locally
	cd $(WEB_DIR) && $(NPM) run dev

api-test: ## Run Go tests
	cd $(API_DIR) && $(GO) test ./...

web-lint: ## Run frontend lint checks
	cd $(WEB_DIR) && $(NPM) run lint

web-test: ## Run frontend unit tests
	cd $(WEB_DIR) && $(NPM) run test

web-build: ## Build the frontend production bundle
	cd $(WEB_DIR) && $(NPM) run build

e2e: ## Run Playwright end-to-end tests
	cd $(WEB_DIR) && $(NPM) run test:e2e

test: api-test web-test ## Run the main automated test suites

verify: api-test web-lint web-test web-build ## Run the core pre-release verification commands

stack-up: init-env ## Build and start the full Docker stack in detached mode
	$(COMPOSE) --profile stack up --build -d

stack-down: ## Stop the full Docker stack
	$(COMPOSE) --profile stack down

stack-logs: ## Tail logs for the full Docker stack
	$(COMPOSE) logs -f postgres api web
