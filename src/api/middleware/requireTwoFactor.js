const validateTwoFactor = require("../../db/modules/validateTwoFactor");

module.exports = (req, res, next) => {
    const twoFactorError = validateTwoFactor(req.account, req.body.token)[0];
    if (twoFactorError) {
        return res.status(twoFactorError.code).json({
            success: false,
            message: twoFactorError.message,
        });
    }

    next();
};
