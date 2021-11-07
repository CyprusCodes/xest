info:
	@cat .cli/info

db-wipe:
	@cd database; docker-compose down
	@cd database; docker-compose rm -fsv
	@docker volume rm database_my-{{PROJECT_NAME_KEBAPCASE}}-db

db-init:
	@echo "Importing data from database/database-up.sql"
	@cd database; docker exec -i {{PROJECT_NAME_KEBAPCASE}}-mysql-db mysql -uroot -ppassword mysql < database-up.sql
	@npm run migrate-up:all
	@cd database; docker exec -i {{PROJECT_NAME_KEBAPCASE}}-mysql-db mysql -uroot -ppassword mysql < db-seed.sql

db-start:
	@cd database; docker-compose up

switch-env:
	@npm run switch-env-vars