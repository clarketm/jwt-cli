"use strict";

const jwt = require("jsonwebtoken");
const clipboard = require("clipboardy");
const chalk = require("chalk");
const { inspect } = require("util");
const { log, error } = console;
const { exit } = process;

const ALGORITHMS = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "none"];
const algorithmsRegex = new RegExp(`^(${ALGORITHMS.join("|")})$`, "i");

// Helpers
function verifyOption(name, value, message = `"${name}" is required`) {
  if (!value) {
    error(message);
    exit(1);
  }
}

function parseObjectOption(name, value, message = `"${name}" must be valid JSON`) {
  try {
    value = JSON.parse(value);
  } catch (err) {
    error(message);
    exit(1);
  }

  return value;
}

function filterOptions(options, predicate = ([, v]) => v !== undefined, reducer = (obj, [k, v]) => ((obj[k] = v), obj)) {
  return Object.entries(options)
    .filter(predicate)
    .reduce(reducer, {});
}

function resolveSecretVariable(secret, passphrase) {
  if (passphrase) {
    return {
      key: secret,
      passphrase
    };
  }
  return secret;
}

// Exports
function sign(payload, secret, options = {}) {
  verifyOption("payload", payload);
  verifyOption("secret", secret);

  let { algorithm, audience, expiresIn, header, issuer, keyid, notBefore, noTimestamp, jwtid, subject, noCopy, passphrase } = options;

  payload = parseObjectOption("payload", payload);
  header = header && parseObjectOption("header", header);

  const jwtOptions = filterOptions({
    algorithm,
    audience,
    expiresIn,
    header,
    issuer,
    keyid,
    notBefore,
    noTimestamp,
    jwtid,
    subject
  });

  try {
    const token = jwt.sign(payload, resolveSecretVariable(secret, passphrase), jwtOptions);
    if (!noCopy) {
      clipboard.writeSync(token);
      log();
      log(chalk.black.bgYellow.bold("copied to clipboard:"));
      log();
    }
    log(chalk(token));
  } catch (err) {
    log();
    log(chalk.red(` ${err.message} `));
    log();
    exit(1);
  }
}

function verify(token, secret, options = {}) {
  verifyOption("token", token);
  verifyOption("secret", secret);

  const { algorithms, audience, clockTimestamp, clockTolerance, ignoreExpiration, ignoreNotBefore, issuer, maxAge, subject, passphrase } = options;

  const jwtOptions = filterOptions({
    algorithms,
    audience,
    clockTimestamp,
    clockTolerance,
    ignoreExpiration,
    ignoreNotBefore,
    issuer,
    maxAge,
    subject
  });

  try {
    jwt.verify(token, resolveSecretVariable(secret, passphrase), jwtOptions);
    log();
    log(chalk.green("valid!"));
  } catch (err) {
    log();
    log(chalk.red(` ${err.message} `));
    log();
    exit(1);
  }
}

function decode(token, options = {}) {
  verifyOption("token", token);

  const { complete, noCopy } = options;

  const jwtOptions = filterOptions({ complete });

  try {
    let payload = jwt.decode(token, jwtOptions);
    if (!noCopy) {
      clipboard.writeSync(JSON.stringify(payload));
      log();
      log(chalk.black.bgYellow.bold("copied to clipboard:"));
      log();
    }
    log(inspect(payload, { depth: null, colors: true, compact: false }));
  } catch (err) {
    log();
    log(chalk.red(` ${err.message} `));
    log();
    exit(1);
  }
}

module.exports = {
  algorithmsRegex,
  sign,
  verify,
  decode
};
