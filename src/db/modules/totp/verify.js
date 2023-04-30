const OTPAuth = require("otpauth");

module.exports = (username, secret, token) => {
	try {
		let totp = new OTPAuth.TOTP({
			issuer: "Lynx",
			label: username,
			algorithm: "SHA1",
			digits: 6,
			period: 30,
			secret,
		});

		let delta = totp.validate({ token: token, window: 1 });

		if (delta === null)
			return [
				null,
				{
					code: 403,
					message: "Expired or invalid TOTP token",
				},
			];

		return [true, null];
	} catch (e) {
		return [
			null,
			{
				code: 500,
				message: "Internal Server Error verifying provided token",
			},
		];
	}
};
