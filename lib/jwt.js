const jwt = require("jsonwebtoken");
const clipboard = require("clipboardy");
const chalk = require("chalk");
const prettyjson = require("prettyjson");
const { log, error } = console;
const { exit } = process;

const algorithms = ["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "none"];
const algorithmsRegex = new RegExp(`^(${algorithms.join("|")})$`, "i");

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

// Exports
function sign(payload, secret, options = {}) {
  verifyOption("payload", payload);
  verifyOption("secret", secret);

  let { algorithm, audience, expiresIn, header, issuer, keyid, notBefore, noTimestamp, jwtid, subject } = options;

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

  const token = jwt.sign(payload, secret, jwtOptions);

  clipboard.writeSync(token);

  log();
  log(chalk.black.bgYellow.bold("copied to clipboard:"));
  log();
  log(chalk(token));
}

function verify(token, secret, options = {}) {
  verifyOption("token", token);
  verifyOption("secret", secret);

  const { algorithm, audience, clockTimestamp, clockTolerance, ignoreExpiration, ignoreNotBefore, issuer, maxAge, subject } = options;

  const jwtOptions = filterOptions({
    algorithm,
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
    jwt.verify(token, secret, jwtOptions);
    log();
    log(chalk.green("valid!"));
    log();
  } catch (err) {
    log();
    log(chalk.red(` ${err.message} `));
    log();
    exit(1);
  }
}

function decode(token, options = {}) {
  verifyOption("token", token);

  const { complete } = options;

  const jwtOptions = filterOptions({ complete });

  try {
    let payload = jwt.decode(token, jwtOptions);
    clipboard.writeSync(JSON.stringify(payload));
    log();
    log(chalk.black.bgYellow.bold("copied to clipboard:"));
    log();
    log(prettyjson.render(payload));
    log();
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
