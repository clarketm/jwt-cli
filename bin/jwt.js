#!/usr/bin/env node

"use strict";

const commander = require("commander");
const { version } = require("../package.json");
const { sign, verify, decode, algorithmsRegex } = require("../lib/jwt");
const { error } = console;
const { exit } = process;

commander.version(version).on("command:*", () => {
  error(`Invalid command: ${commander.args.join(" ")}\nSee --help for a list of available commands.`);
  exit(1);
});

commander
  .command("sign [payload] [secret]")
  // .alias("create")
  .description("Sign a new JWT")
  .option("-a, --algorithm [algorithm]", "Identifies the cryptographic algorithm used to secure the JWT.", algorithmsRegex, "HS256")
  .option("-d, --audience [audience]", "Identifies the recipient(s) that the JWT is intended for.")
  .option("-e, --expiresIn [time]", "Identifies the expiration time on or after which the JWT must not be accepted for processing.", "1 hour")
  .option("-h, --header [header]", "Header for JWT.")
  .option("-i, --issuer [issuer]", "Identifies principal that issued the JWT.")
  .option("-k, --keyid [keyid]", "A hint indicating which key was used to secure the JWS.")
  .option("-b, --notBefore [time]", "Identifies the time before which the JWT must not be accepted for processing.")
  .option("-t, --noTimestamp", "The generated JWT will not include an iat.")
  .option("-j, --jwtid [jwtid]", "Case sensitive unique identifier")
  .option("-s, --subject [subject]", "Identifies the subject of the JWT.")
  .action(sign);

commander
  .command("verify [token] [secret]")
  .description("Verify a JWT")
  .option("-a, --algorithms [algorithms]", "Identifies the cryptographic algorithm used to secure the JWT.")
  .option("-d, --audience [audience]", "Identifies the recipient(s) that the JWT is intended for.")
  .option("-t, --clockTimestamp [seconds]", "The time in seconds that should be used as the current time for all comparisons.")
  .option("-c, --clockTolerance [seconds]", "The number of seconds to tolerate when checking the nbf and exp claims.")
  .option("-e, --ignoreExpiration", "If true do not validate the expiration of the token.")
  .option("-b, --ignoreNotBefore", "If true do not validate the not before of the token.")
  .option("-i, --issuer [issuer]", "Identifies principal that issued the JWT.")
  .option("-m, --maxAge [time]", "The maximum allowed age for tokens to still be valid.")
  .option("-s, --subject [subject]", "Identifies the subject of the JWT.")
  .action(verify);

commander
  .command("decode [token]")
  .description("Decode a JWT")
  .option("-c, --complete", "Return header, payload, and signature.")
  .action(decode);

// TODO
// .command('refresh')

// TODO
// commander
//   .command('scope')
//   .description('Scopes of a JWT')
//   .option('-l, --list', 'List scopes of JWT.')
//   .option('-v, --verify [scopes]', 'Scope(s) to verify against JWT.')

commander.parse(process.argv);
