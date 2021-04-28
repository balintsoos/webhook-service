help: ## Show this help
	@echo "Usage:\n\n  make [target]\n\nTargets:\n"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/\(.*\):.*##[ \t]*/  \1 ## /' | column -t -s '##'
	@echo

build: ## Build service
	docker-compose build

up: ## Setup and start service
	docker-compose up --detach

down: ## Stop and teardown service
	docker-compose down --volumes --rmi all

test: ## Run tests
	npm test
