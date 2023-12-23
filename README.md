## Introduction
* The first project startup requires:
    * `nvm use 20`
    * `git checkout develop`
    * `npm ci`
    * Add variables to **`.env`**: 
      * `APP_ENV=local`
      * `APP_NAME=Koryavko`
      * `API_URL=localhost:3000`
      * `PORT=3000`
      * `REDIS_URL=redis://:root@redis:6379`
      * `DATABASE_URL=postgres://testuser:testpassword@postgres:5432/main_db`
    * `docker compose up -d`
      * In case of an error when starting the application that there is no main_db table, create it manually

## Technologies

* Node 20.10
* [NestJS](https://docs.nestjs.com/)
* Postgres
* Redis

## Structure

Project has 4 layers:

* Domain
    * This layer contains primary logic of the project:
        * Entities
        * Enums
        * Services and logic
        * Common interfaces
        * Common DTOs and VOs
* Presentation
    * This layer accepts requests via the HTTP protocol
* Infrastructure
    * This layer contains:
        * Classes for external services
        * Database migrations
        * Data mappers
        * Nestjs modules and components
        * Health check endpoint
* Application
    * This layer contains *use cases* of this service

## Good-to-knows

* Service has feature tests for some services and actions
    * `npm run test`
* To create a migration you need to execute the command
  * `NAME=SetTableNameOrActionForTable npm run migrate:create`
* The project uses git flow. To start it, run the command:
  * `git flow init`

If in directory *.husky* doesn't exist file *pre-commit*, run the command:
```shell
npx husky add .husky/pre-commit "npm run lint-staged"
```
[Manual install](https://typicode.github.io/husky/#/?id=install) of hasky pre-commit hooks.
