# jwt-utils

JSON Web Tokens (JWT) command-line utilities.

## Installation

### Yarn

```shell
yarn add "@clarketm/jwt-utils"
```

### Npm

```shell
npm install "@clarketm/jwt-utils" --save
```

## Usage

### `sign [options] payload secret`

> Note: the `sign` subcommand accepts **all** options as [`auth0/node-jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
> with the exception of `mutatePayload` which is not applicable.

```shell
$ jwt sign '{"user": "Travis Clarke"}' "super secret"
```

```shell
copied to clipboard:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhIjoxLCJpYXQiOjE1MjczMTI3NTIsImV4cCI6MTUyNzMxNjM1Mn0.2l4wyaoxNBBY7nvm6sAqAcmXSuuKjBubNo_h42hcigU
```

### `verify [options] token secret`

> Note: the `verify` subcommand accepts **all** options as [`auth0/node-jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)

```shell
$ jwt verify "eyJhbGciOiJIUzI1..." "super secret"
```

```
valid!
```

### `decode [options] token`

> Note: the `decode` subcommand accepts **all** options as [`auth0/node-jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback)
> with the exception of `json` which is not applicable.

```shell
$ jwt decode "eyJhbGciOiJIUzI1..."
```

```shell
copied to clipboard:

a:   1
iat: 1527312832
exp: 1527316432
```

## Related

* [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) – JsonWebToken implementation for node.js

## License

MIT &copy; [**Travis Clarke**](https://blog.travismclarke.com/)
