# NestJS Authentication and Authorization

## Description

NestJS authentication and authorization using Bcrypt, JWT & Redis

## APIs

1. **Sign up**
2. **Sign in**
3. **Show my profile**
4. **Sign out**

## Prerequisites

- [Node.js v14 or above](https://nodejs.org/en/download/)
- [npm v7 or above](https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)

## Technologies stack:

- [Typescript](https://www.typescriptlang.org/)
- [Nest.js](https://nestjs.com/)
- [JWT](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [TypeORM](https://typeorm.io/) (ORM) + [MySQL](https://www.mysql.com/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/products/docker-desktop)

## Setup

### 1. Install the required dependencies

```bash
$ npm install
```

### 2. Rename the .env.example filename to .env and set your local variables

```bash
$ mv .env.example .env
```

### 3. Start the application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker

```bash
# start application
$ npm run docker:up

# down application
$ npm run docker:down
```
