# API service for Jobhub

## Culture
- We are team of passionated software developers and we have our own git management guideline, visit our [Git guideline](./doc/git-convention.md)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) are welcome
- We use Github for *TMS* purpose as well, here is our [automated board](https://github.com/orgs/Jobhubgroup/projects/1) 

## Documentation

* [Swagger on staging server](http://jobhub-api.herokuapp.com/doc)  
* [Git Doc](#api-documentation)  

* OpenAPI document is available on `/doc`

## Deployment Guideline
* [Deployment](./doc/deployment.md)

## Technical Stacks

* [PostgreSQL](https://www.postgresql.org/)
* [Node.js](https://nodejs.org/en/)
* [Nest.js](https://nestjs.com/)

## Environment
Make a copy of .env.example.
```bash
$ cp .env.example .env
```

### Database Configuration

Configure DATABASE_URL in .env file.
```
DATABASE_URL = postgres://[USER_NAME]:[PASSWORD]@[DOMAIN]:[PORT_NUMBER]/[DATABASE_NAME]
```

##### Example

```
DATABASE_URL = postgres://root:root@localhost:5432/jobhub
```

### Migrations
* Run typeorm CLI, see detailed doc [here](https://typeorm.io/#/using-cli)
```
$ npm run typeorm <additional-commands>
```
* Create a new migration
```
$ npm run typeorm:migrate <migration-name> # We recommend to use Pascal Case for migration
```
* Run migration manually
```
$ npm run typeorm:run
```

### Preparing Idea-board Entries
* Prepare idea-board images.
* Upload ide-board images to AWS S3 bucket.
```bash
$ npm run idea-seed -- --directory=</path/to/images/directory> --from=<from-num> --to=<to-num>
```
* Prepare idea-board data file.<br>
Store idea-board entries to `/project-dir/data/idea-board-data.txt` in the following format.<br>
```
<image-number>\t<project-accessory-type>\t<material-type>\n
```

## Development

```bash
$ npm install

# run server in watch mode
$ npm run start:dev

# build in production mode
$ npm run start:prod
```

## API Documentation

You can check detailed API documentation from [here](./doc/doc.md) 

---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
