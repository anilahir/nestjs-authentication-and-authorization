# NestJS Authentication

![Workflow Test](https://github.com/anilahir/nestjs-authentication-and-authorization/actions/workflows/ci.yml/badge.svg)
![Prettier](https://img.shields.io/badge/Code%20style-prettier-informational?logo=prettier&logoColor=white)
[![GPL v3 License](https://img.shields.io/badge/License-GPLv3-green.svg)](./LICENSE)
[![HitCount](https://hits.dwyl.com/anilahir/nestjs-authentication-and-authorization.svg)](https://hits.dwyl.com/anilahir/nestjs-authentication-and-authorization)

## Description

NestJS Authentication without Passport using Bcrypt, JWT and Redis

## Features

1. Register
2. Login
3. Show profile
4. Logout

## Technologies stack:

- JWT
- Bcrypt
- TypeORM + MySQL
- Redis
- Docker

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

## Docker for development

```bash
# start the application
$ npm run docker:up

# stop the application
$ npm run docker:down
```

## Swagger documentation

- [localhost:3000/docs](http://localhost:3000/docs)

## References

- [NestJS Authentication without Passport](https://trilon.io/blog/nestjs-authentication-without-passport)
- [NestJS, Redis and Postgres local development with Docker Compose](https://www.tomray.dev/nestjs-docker-compose-postgres)

## Author

👤 **Anil Ahir**

- Twitter: [@anilahir220](https://twitter.com/anilahir220)
- Github: [@anilahir](https://github.com/anilahir)
- LinkedIn: [@anilahir](https://www.linkedin.com/in/anilahir)

## Show your support

Give a ⭐️ if this project helped you!

## Related projects

Explore more NestJS example projects:

[![GraphQL example](https://github-readme-stats.vercel.app/api/pin/?username=anilahir&repo=nestjs-graphql-demo)](https://github.com/anilahir/nestjs-graphql-demo)

## License

Release under the terms of [MIT](./LICENSE)
