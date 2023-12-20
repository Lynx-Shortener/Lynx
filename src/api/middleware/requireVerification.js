const totp = require("../../db/modules/totp");
const checkPassword = require("../../db/modules/password/check");

module.exports = (req, res, next) => {
    const { verification } = req.body;
    if (!verification) {
        return res.status(412).json({
            success: false,
            message: "Verification required, please provide a verification object with either a 2FA token or password, depending on what is set up.",
        });
    }

    const { token, password } = verification;
    if (req.account.twoFactorAuthentication.enabled) {
        if (req.account.twoFactorAuthentication.totp.verified) {
            if (!token) {
                return res.status(403).json({
                    success: false,
                    message: "2FA required",
                });
            }

            const totpVerificationFailure = totp.verify(req.account.username, req.account.twoFactorAuthentication.totp.secret, token)[1];

            if (totpVerificationFailure) {
                return res.status(totpVerificationFailure.code).json({
                    success: false,
                    message: totpVerificationFailure.message,
                });
            }
        } else {
            console.log("Two factor enabled, but no methods available, allowing access by password.");
        }
    } else {
        if (!password) {
            return res.status(403).json({
                success: false,
                message: "Password required",
            });
        }

        const passwordCorrect = checkPassword(password, req.account.password);

        if (!passwordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }
    }

    next();
};
