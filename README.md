# developer-access-token-service

Service that will be used to provide developer tokens for developers to use for backend API access

# development

## Running the Service

1. provide environment variables as shown in `.env-sample`
2. run `docker-compose build`
3. run `docker-compose up -d`

if this is your first time running the service, run `docker-compose exec dev-token-api npm run dbsync` when container is running to apply db schema

## Login

to create admin token for login run `npm run generateToken -- --name="Your Name" --email=email@domain.com`
save the generated token to login
