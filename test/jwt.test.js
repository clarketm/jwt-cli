const shell = require("shelljs");
const clipboard = require("clipboardy");
const fs = require("fs");

describe("jwt", () => {
  beforeEach(() => {
    clipboard.writeSync("");
  });

  describe("#sign", () => {
    it("should copy token to the clipboard", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      expect(token).toBeDefined();
    });

    it("should fail if the `payload` is not defined", () => {
      let cmd = shell.exec(`node ./bin/jwt.js sign`);

      expect(cmd.code).toBe(1);
    });

    it("should fail if the `secret` is not defined", () => {
      let payload = JSON.stringify({ a: 1 });

      let cmd = shell.exec(`node ./bin/jwt.js sign '${payload}'`);

      expect(cmd.code).toBe(1);
    });

    it("should default algorithm to `HS256`", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.header.alg).toBe("HS256");
    });

    it("should set algorithm to `RS256` and sign with a private key", () => {
      let algorithm = "RS256";

      let payload = JSON.stringify({ a: 1 });
      let cert = fs.readFileSync("./test/cert/rs256.key");

      shell.exec(`node ./bin/jwt.js sign --algorithm '${algorithm}' -- '${payload}' '${cert}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.header.alg).toBe(algorithm);
    });

    it("should set algorithm to `ES256` and sign with a private key", () => {
      let algorithm = "ES256";

      let payload = JSON.stringify({ a: 1 });
      let cert = fs.readFileSync("./test/cert/es256.key");

      shell.exec(`node ./bin/jwt.js sign --algorithm '${algorithm}' -- '${payload}' '${cert}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.header.alg).toBe(algorithm);
    });

    it("should set algorithm to `none`", () => {
      let algorithm = "none";

      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --algorithm '${algorithm}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.header.alg).toBe(algorithm);
    });

    it("should set algorithm to `HS384`", () => {
      let algorithm = "HS384";

      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --algorithm '${algorithm}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.header.alg).toBe(algorithm);
    });

    it("should set `audience` to the specified value", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let audience = "http://domain.com/api/v1";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --audience '${audience}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.payload.aud).toBe(audience);
    });

    it("should not copy to clipboard if --noCopy option is present", done => {
      const payload = JSON.stringify({ a: 1 });
      const secret = "super secret";
      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --noCopy`, (code, stdout) => {
        const clipboardToken = clipboard.readSync();
        // Match token on anything with two dots between that doesn't start with a whitespace
        var tokenFromStdout = stdout.match(/(\S.*\..*\.*)/g)[0];

        expect(clipboardToken).not.toBe(tokenFromStdout);
        // Fallback test where we just check if the copied to clipboard line is not being written to stdout
        expect(stdout.indexOf("clipboard")).toBe(-1);
        done();
      });
    });

    it("should fail if `audience` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      let cmd = shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --audience`);

      expect(cmd.code).toBe(1);
    });

    it("should default expiration to `1h`", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let seconds = Math.trunc(new Date().getTime() / 1000) + 60 * 60;
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.payload.exp).toBe(seconds);
    });

    it("should set `expiration` to the specified value", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let expiresIn = "1 day";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --expiresIn '${expiresIn}'`);
      let expires = Math.trunc(new Date().getTime() / 1000) + 60 * 60 * 24;
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.payload.exp).toBe(expires);
    });

    it("should set `header` to the specified value", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let header = JSON.stringify({ typ: "test" });

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --header '${header}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.header.typ).toBe("test");
    });

    it("should fail if `header` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      let cmd = shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --header`);

      expect(cmd.code).toBe(1);
    });

    it("should set `issuer` to the specified value", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let issuer = "http://domain.com";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --issuer '${issuer}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.payload.iss).toBe(issuer);
    });

    it("should fail if `issuer` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      let cmd = shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --issuer`);

      expect(cmd.code).toBe(1);
    });

    it("should set `keyid` to the specified value", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let keyid = "helpful key";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --keyid '${keyid}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.header.kid).toBe(keyid);
    });

    it("should fail if `keyid` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      let cmd = shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --keyid`);

      expect(cmd.code).toBe(1);
    });

    it("should set `notBefore` to the specified value", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let notBefore = "1 minute";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --notBefore '${notBefore}'`);
      let seconds = Math.trunc(new Date().getTime() / 1000) + 60;
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.payload.nbf).toBe(seconds);
    });

    it("should fail if `notBefore` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      let cmd = shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --notBefore`);

      expect(cmd.code).toBe(1);
    });

    it("should set `noTimestamp` and as a result `iat` should be excluded from payload", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let keyid = "helpful key";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --noTimestamp`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.payload.iat).toBeUndefined();
    });

    it("should set `jwtid` to the specified value", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let jwtid = "unique id";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --jwtid '${jwtid}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.payload.jti).toBe(jwtid);
    });

    it("should fail if `jwtid` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      let cmd = shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --jwtid`);

      expect(cmd.code).toBe(1);
    });

    it("should set `subject` to the specified value", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let subject = "science";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --subject '${subject}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.payload.sub).toBe(subject);
    });

    it("should fail if `subject` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      let cmd = shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --subject`);

      expect(cmd.code).toBe(1);
    });
  });

  describe("#verify", () => {
    it("should output `valid!` for a valid token", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}'`);

      expect(cmd.stdout).toMatch(/\s*valid!\s+/);
    });

    it("should successfully `verify` a valid token", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}'`);

      expect(cmd.code).toBe(0);
    });

    it("should fail if the `token` is not defined", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);

      let cmd = shell.exec(`node ./bin/jwt.js verify`);

      expect(cmd.code).toBe(1);
    });

    it("should fail if the `secret` is not defined", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}'`);

      expect(cmd.code).toBe(1);
    });

    it("should verify when `algorithms` is specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let algorithm = "HS384";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --algorithm '${algorithm}'`);
      let token = clipboard.readSync();

      let algorithms = "HS384";
      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --algorithms '${algorithms}'`);

      expect(cmd.code).toBe(0);
    });

    it("should verify when `algorithms` is specified and a space-separated list", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let algorithm = "HS384";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --algorithm '${algorithm}'`);
      let token = clipboard.readSync();

      let algorithms = "HS256 HS384";
      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --algorithms '${algorithms}'`);

      expect(cmd.code).toBe(0);
    });

    it("should fail if `algorithms` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let algorithm = "HS384";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --algorithm '${algorithm}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --algorithms 'bogus'`);

      expect(cmd.code).toBe(1);
    });

    it("should verify when `audience` is specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let audience = "http://domain.com/api/v1";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --audience '${audience}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --audience '${audience}'`);

      expect(cmd.code).toBe(0);
    });

    it("should fail if `audience` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let audience = "http://domain.com/api/v1";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --audience '${audience}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --audience 'bogus'`);

      expect(cmd.code).toBe(1);
    });

    it("should verify when `issuer` is specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let issuer = "http://domain.com";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --issuer '${issuer}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --issuer '${issuer}'`);

      expect(cmd.code).toBe(0);
    });

    it("should fail if `issuer` value is not specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let issuer = "http://domain.com/api/v1";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --issuer '${issuer}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --issuer 'bogus'`);

      expect(cmd.code).toBe(1);
    });

    it("should verify when `subject` is specified", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let subject = "http://domain.com";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --subject '${subject}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --subject '${subject}'`);

      expect(cmd.code).toBe(0);
    });

    it("should fail if `subject` value is invalid", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let subject = "science";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --subject '${subject}'`);
      let token = clipboard.readSync();

      let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --subject 'bogus'`);

      expect(cmd.code).toBe(1);
    });

    it("should fail if `maxAge` time has passed", done => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";
      let maxAge = "1 second";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      setTimeout(() => {
        let cmd = shell.exec(`node ./bin/jwt.js verify '${token}' '${secret}' --maxAge '${maxAge}'`);
        expect(cmd.code).toBe(1);
        done();
      }, 1000);
    });

    // TODO:
    // --clockTimestamp [seconds]
    // --clockTolerance [seconds]
    // --ignoreExpiration
    // --ignoreNotBefore
  });

  describe("#decode", () => {
    it("should copy `payload` to the clipboard", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}'`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.a).toBe(1);
    });

    it("should include `header` in result if the `complete` options is provided", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.header).toBeDefined();
    });

    it("should exclude `header` from result if the `complete` options is not provided", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}'`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.header).toBeUndefined();
    });

    it("should include `signature` in result if the `complete` options is provided", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}' --complete`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.signature).toBeDefined();
    });

    it("should exclude `signature` from result if the `complete` options is not provided", () => {
      let payload = JSON.stringify({ a: 1 });
      let secret = "super secret";

      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}'`);
      let token = clipboard.readSync();

      shell.exec(`node ./bin/jwt.js decode '${token}'`);
      let payloadParsed = JSON.parse(clipboard.readSync());

      expect(payloadParsed.signature).toBeUndefined();
    });

    it("should not copy to clipboard if --noCopy option is present", done => {
      const payload = JSON.stringify({ a: 1 });
      const secret = "super secret";
      shell.exec(`node ./bin/jwt.js sign '${payload}' '${secret}' --noCopy`, (code, stdout) => {
        const clipboardToken = clipboard.readSync();
        // Match token on anything with two dots between that doesn't start with a whitespace
        var tokenFromStdout = stdout.match(/(\S.*\..*\.*)/g)[0];

        expect(clipboardToken).not.toBe(tokenFromStdout);
        // Fallback test where we just check if the copied to clipboard line is not being written to stdout
        expect(stdout.indexOf("clipboard")).toBe(-1);
        done();
      });
    });
  });
});
