# developer-access-token-service

Service that will be used to provide developer tokens for developers to use for backend API access. Operated by admin.

---

- [Authentication](#authentication)
- [Usage](#usage)
  - [Scope and Actions](#scope-and-actions)
  - [Developer Token](#developer-token)
  - [Token Validation](#token-validation)
- [REST API](#rest-api)
  - [Data Models](#data-models)
  - [Postman Documentation](#postman-documentation)
- [Development](#development)
  - [Running the Service](#running-the-service)
  - [Test Scripts](#test-scripts)
- [Deployment](#deployment)
  - [Resources Provisioning](#resources-provisioning)
  - [Production Build](#production-build)
- [Scripts](#scripts)

# Authentication

to create **access token** for login, run `npm run generateToken -- --name="Your Name" --email=email@domain.com`
save the generated token to login either using API `/auth/login` or using UI.

When using API **session/auth token** is needed to access resources, **session/auth token** is obtained by `sending access token` to `/auth/login`

# Usage

## Scope and Actions

Actions is the name of certain operation on a service, scope is a group of allowed actions by a certain purpose. for example, `manage race` scope will include several actions like `read all races` `read race by id` `update race` `create race` `delete race`. on the other hand `view race` scope will only include `read all races` and `read race by id`. these list of actions are what will be used to limit an operation in a service based on if the passed token has coresponding action granted.

## Developer Token

Developer token is a group of scopes granted to a developer resulting a token. this token will later be used by developer to access resources of others services.
Token will only appears once after saving the token, please keep it somewhere safe.

## Token Validation

to validate token, use `POST /validate`. will returns developer profile, assigned scopes and allowed actions, use this list of actions to grant permission to perform operations.

# REST API

API provides functionalities to manage scopes, actions, developer and tokens.
API using Bearer token for authentication, the token can be retrieved from `POST /auth/login` endpoint with `access_token`.
Complete documentation of the API can be found in postman collection `/doc/SYRF.postman_collection.json`.

## Data Models

The data model used in `developer token service` can be found in `/doc/DataModel.jpg`

## Postman Documentation

Postman documentation can be found in `/doc/SYRF.postman_collection.json`
some environment set up for postman in needed

- **baseUrl** : host of the service, ex : http://localhost:5000
- **version** : version of the service url, ex : /v1
- **token** : session token to access resources, can be retrieved when login

# Development

## Running the Service

1. provide environment variables as shown in `.env-sample`
2. run `docker-compose build`
3. run `docker-compose up -d`

if this is your first time running the service, run `docker-compose exec dev-token-api npm run dbsync` when container is running to apply db schema

## Test Scripts

Running test suites :

1. provide `.env.test` in `/src/api` with `access token` and `session/auth token` (check `.env.test-sample`)
2. Run the service using `docker-compose up -d`
3. Run this command `docker-compose exec dev-token-api npm run test`

# Deployment

There are 2 parts of deployment **Resources Provisioning** and **Production Build**

## Resources Provisioning

This steps required to provision resources in AWS environment using _Terraform_. To run terraform, follow this steps :

1. provide `.env` file in `deployment/` (see `.env.sample`)
2. `cd` into the `deployment/` directory
3. run `docker-compose run terraform init`
4. run `docker-compose run terraform apply`
5. provide database password when promted
6. follow the instructions prompted

after the process, there will be some outputs

- alb_dns_name : is the host of the app. this will be the base url for the API
- ecr_repo_url : is the repo to push image

this variables will be used in building image for production

## Development Build

This service was deployed to aws development environment using terraform similar to the raw server service
In the terraform file the vpc id that was created for the first service was used. So all the services that was deployed (raw server, live data server and developer token) were all deployed in the same vpc
the credentials for the database was used in the .env file when building the image

To deploy the service you need to run
docker-compose -f deployment/docker-compose.yml run --rm terraform init
docker-compose -f deployment/docker-compose.yml run --rm terraform validate
docker-compose -f deployment/docker-compose.yml run --rm terraform plan
docker-compose -f deployment/docker-compose.yml run --rm terraform apply
after running terraform apply you need to build the image and push the image to ecr
the service can be accessed from this url - http://dev-token-lb-662457357.us-east-1.elb.amazonaws.com/login

## Production Build

following is the steps to build production image

1. adjust environment variables, here is variables that should be checked

- REACT_APP_STORAGE_API_BASE : your host address for example (http://example.com). this will be used for the UI to make request to
- REACT_APP_STORAGE_AUTH_KEY : local storage key to save token
- DB_HOST : database host address
- DB_PORT : database port
- DB_USER : database user
- DB_PASSWORD : database password
- DB_NAME : database name
- JWT_SECRET : JWT secret to create tokens

2. run `docker-compose -f production-compose.yml build`
3. If this is first deployment, run `docker-compose -f production-compose.yml run --rm dev-token-service npm run dbsync` to migrate db structure
4. tag the build, run `docker tag dev-token-service ecr_repo_url` (replace `ecr_repo_url` with the value from terrform steps)
5. login your docker to authenticate push following [this](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html) steps
6. push image, run `docker push ecr_repo_url`

after the image is pushed. open the `alb_dns_name/v1/health` in browser. should reply with json message `ok`

# Scripts

## Seed

The script is in `src/api/scripts/seedActions.js` and `src/api/scripts/seed.js`. Used to add actions and scopes that are not in database yet from the action list in `src/api/scripts/live-data-actions.json` and `src/api/scripts/streaming-actions.json`

steps to run the script :

1. cd to `src/api`
2. update the `src/api/scripts/live-data-actions.json` or `src/api/scripts/streaming-actions.json` with the actions you want to add to db
3. adjust these values `DB_HOST`,`DB_PORT`,`DB_USER`,`DB_PASSWORD`,`DB_NAME` in the env file `src/api/.env`
4. run `npm run seed`
