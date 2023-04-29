const totp = require("../../db/modules/totp");

module.exports = (req, res, next) => {
	if (!req.account.totp.enabled) return next();

	const { token } = req.body;

	if (!token)
		return res.status(403).json({
			success: false,
			message: "2FA token required",
		});

	const [totpVerificationSuccess, totpVerificationFailure] = totp.verify(req.account.username, req.account.totp.secret, token);

	if (totpVerificationFailure)
		return res.status(totpVerificationFailure.code).json({
			success: false,
			message: totpVerificationFailure.message,
		});

	next();
};
