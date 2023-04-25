const OTPAuth = require("otpauth");

let secret = "FPSCTHDVVWKHLV676EYJHZQLXPIWNJNB"
let username = "admin"

let totp = new OTPAuth.TOTP({
    issuer: "Lynx",
    label: username,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
})

let currentToken = totp.generate();

let delta = totp.validate({ token: "243815", window: 1 });

console.log(delta)
