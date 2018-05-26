# jwt-utils

Command line utilities for working with JSON Web Tokens (JWT).

## Installation

### Yarn

```shell
yarn global add "@clarketm/jwt-utils"
```

### Npm

```shell
npm install --global "@clarketm/jwt-utils"
```

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
