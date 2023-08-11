const OTPAuth = require("otpauth");

module.exports = (username) => {
    try {
        const secret = new OTPAuth.Secret().base32;

        const totp = new OTPAuth.TOTP({
            issuer: "Lynx",
            label: username,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret,
        });

        return [
            {
                secret,
                uri: totp.toString(),
            },
            null,
        ];
    } catch (e) {
        console.log(e);
        return [
            null,
            {
                code: 500,
                message: "Internal Server Error when generating TOTP secret",
            },
        ];
    }
};
