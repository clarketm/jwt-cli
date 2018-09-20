# [jwt-cli](https://blog.travismclarke.com/project/jwt-cli/)

[![NPM release](https://img.shields.io/npm/v/@clarketm/jwt-cli.svg)](https://www.npmjs.com/package/@clarketm/jwt-cli)
[![Build Status](https://circleci.com/gh/clarketm/jwt-cli.svg?style=shield)](https://circleci.com/gh/clarketm/jwt-cli)
[![License](https://img.shields.io/npm/l/@clarketm/jwt-cli.svg)](LICENSE.md)

Command line utilities for working with JSON Web Tokens (JWT).

<br>
<br>
<a href="https://blog.travismclarke.com/project/jwt-cli/">
  <p align="center"><img width="40%" src="/hero.png" /></p>
</a>

## Installation

### Yarn

```shell
yarn global add "@clarketm/jwt-cli"
```

### Npm

```shell
npm install --global "@clarketm/jwt-cli"
```

## Demo

![usage demo](/usage.gif)

## Usage

### `sign [options] payload secret`

```shell
$ jwt sign '{"user": "Travis Clarke"}' "super secret"
```

```shell
copied to clipboard:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoxLCJpYXQiOjE1MjczMTI3NTIsImV4cCI6MTUyNzMxNjM1Mn0.2l4wyaoxNBBY7nvm6sAqAcmXSuuKjBubNo_h42hcigU
```

> Note: the `sign` subcommand accepts **all** the same options as [`auth0/node-jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback) with the exception of `mutatePayload` which is not applicable.

### `verify [options] token secret`

```shell
$ jwt verify "eyJhbGciOiJIUzI1..." "super secret"
```

```
valid!
```

> Note: the `verify` subcommand accepts **all** the same options as [`auth0/node-jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)

### `decode [options] token`

```shell
$ jwt decode "eyJhbGciOiJIUzI1..."
```

```shell
copied to clipboard:

a:   1
iat: 1527312832
exp: 1527316432
```

> Note: the `decode` subcommand accepts **all** the same options as [`auth0/node-jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback) with the exception of `json` which is not applicable.

## Related

* [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) – JsonWebToken implementation for node.js

## License

MIT &copy; [**Travis Clarke**](https://blog.travismclarke.com/)
