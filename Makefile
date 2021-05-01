docker-compose = docker-compose --file docker-compose.dev.yml

help: ## Show this help
	@echo "\nUsage:\n\n  make [target]\n\nTargets:\n"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/\(.*\):.*##[ \t]*/  \1 ## /' | column -t -s '##'
	@echo

build: ## Build containers
	$(docker-compose) build

up: ## Setup and start containers
	$(docker-compose) up --detach

ps: ## Show containers
	$(docker-compose) ps --all

down: ## Stop and teardown containers
	$(docker-compose) down --volumes --rmi all
