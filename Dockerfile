FROM node:alpine as clientbuilder
WORKDIR /app
COPY ./src/client/package*.json ./
RUN npm ci --only=production
COPY ./src/client/ .

ARG INLINE_RUNTIME_CHUNK
ARG REACT_APP_STORAGE_API_BASE
ARG REACT_APP_STORAGE_AUTH_KEY

ENV INLINE_RUNTIME_CHUNK $INLINE_RUNTIME_CHUNK
ENV REACT_APP_STORAGE_API_BASE $REACT_APP_STORAGE_API_BASE
ENV REACT_APP_STORAGE_AUTH_KEY $REACT_APP_STORAGE_AUTH_KEY

RUN npm run build

FROM node:alpine

WORKDIR /app

COPY ./src/api/package*.json ./
RUN npm ci --only=production
COPY ./src/api/ .
COPY ../../.env.prod ./.env
COPY --from=clientbuilder /app/build /app/public/build
EXPOSE 5000

CMD ["npm", "run", "start"]