# Methods

## `create`|`sign`

### options:

* algorithm (default: HS256)
* expiresIn: expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").
* notBefore: expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").
* audience
* issuer
* jwtid
* subject
* noTimestamp
* header
* keyid
* mutatePayload: if true, the sign function will modify the payload object directly. This is useful if you need a raw reference to the payload after claims have been applied to it but before it has been encoded into a token.

## `verify`

### options:

* algorithms: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
* audience: if you want to check audience (aud), provide a value here. The audience can be checked against a string, a regular expression or a list of strings and/or regular expressions. Eg: "urn:foo", /urn:f[o]{2}/, [/urn:f[o]{2}/, "urn:bar"]
* issuer (optional): string or array of strings of valid values for the iss field.
* ignoreExpiration: if true do not validate the expiration of the token.
* ignoreNotBefore...
* subject: if you want to check subject (sub), provide a value here
* clockTolerance: number of seconds to tolerate when checking the nbf and exp claims, to deal with small clock differences among different servers
* maxAge: the maximum allowed age for tokens to still be valid. It is expressed in seconds or a string describing a time span zeit/ms. Eg: 1000, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").
* clockTimestamp: the time in seconds that should be used as the current time for all necessary comparisons.

## `decode`

### options:

## `refresh`

### options:

## `check` (scope(s))

### options:

# Algorithms

* HS256 HMAC using SHA-256 hash algorithm
* HS384 HMAC using SHA-384 hash algorithm
* HS512 HMAC using SHA-512 hash algorithm
* RS256 RSASSA using SHA-256 hash algorithm
* RS384 RSASSA using SHA-384 hash algorithm
* RS512 RSASSA using SHA-512 hash algorithm
* ES256 ECDSA using P-256 curve and SHA-256 hash algorithm
* ES384 ECDSA using P-384 curve and SHA-384 hash algorithm
* ES512 ECDSA using P-521 curve and SHA-512 hash algorithm
* none No digital signature or MAC value included
