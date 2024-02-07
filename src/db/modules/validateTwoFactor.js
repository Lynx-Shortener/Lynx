const verifyTotp = require("./totp/verify");

module.exports = (account, token) => {
    if (!account.twoFactorAuthentication.enabled) return [{ code: 200, message: "Two factor not enabled" }, null];

    if (!token) return [null, { code: 403, message: "2FA token required" }];

    const twoFactorMethods = account.twoFactorAuthentication;

    if (twoFactorMethods.totp) {
        const totpVerificationFailure = verifyTotp(account.username, twoFactorMethods.totp.secret, token)[1];

        if (totpVerificationFailure) return [null, totpVerificationFailure];
    } else {
        console.log("Two factor enabled, but no methods available, allowing access by default.");
    }

    return [true, null];
};
