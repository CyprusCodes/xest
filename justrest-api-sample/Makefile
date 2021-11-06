info:
	@cat .cli/info

db-wipe:
	@cd infrastructure; docker-compose down
	@cd infrastructure; docker-compose rm -fsv
	@docker volume rm infrastructure_my-{{PROJECT_NAME_KEBAPCASE}}-db

db-init:
	@echo "Importing data from infrastructure/database-up.sql"
	@cd infrastructure; docker exec -i {{PROJECT_NAME_KEBAPCASE}}-mysql-db mysql -uroot -ppassword mysql < database-up.sql
	@npm run migrate-up:all
	@cd infrastructure; docker exec -i {{PROJECT_NAME_KEBAPCASE}}-mysql-db mysql -uroot -ppassword mysql < db-seed.sql

db-start:
	@cd infrastructure; docker-compose up

switch-env:
	@npm run switch-env-vars