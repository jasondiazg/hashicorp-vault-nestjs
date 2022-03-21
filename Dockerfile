FROM node:14.17.1-alpine as base

WORKDIR /app

FROM base as restore

COPY ./dist ./dist
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

FROM base

COPY --from=restore /app /app

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
