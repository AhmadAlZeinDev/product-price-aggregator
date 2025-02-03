<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F7c6642d9d9b75e2090693773e3c470fa.cdn.bubble.io%2Ff1704517099894x454130768036798700%2FGroup%252053632.png?w=256&h=54&auto=compress&dpr=1.25&fit=max" width="200" alt="Digital Zone Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Product Price Aggregator with NestJS and Prisma</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## JSON Server

```bash
# Mock Servers
$ npm install -g json-server
$ json-server --watch data/primary-products.json --port 8001
$ json-server --watch data/secondary-products.json --port 8002
$ json-server --watch data/tertiary-products.json --port 8003
```

## Prisma

```bash
# Generate Prisma Client
$ npx prisma generate

# For Dev
$ npx prisma migrate dev

# For Production
$ npx prisma migrate deploy
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# swagger
$ http://localhost:7777/api/swagger
```

## Test

```bash
# unit tests
$ npm run test
```

## Support

For any further questions or clarifications, please contact me by:
Email: ahmadalzein267@gmail.com
Or
Mobile Number: +971547551927

## Stay in touch

- Author - [Ahmad Al-Zein](https://www.linkedin.com/in/ahmad-al-zein)

## License

Nest is [MIT licensed](LICENSE).
