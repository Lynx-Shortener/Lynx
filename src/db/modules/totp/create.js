const OTPAuth = require("otpauth");

module.exports = () => {
	try {
		const secret = new OTPAuth.Secret();
		return [secret.base32, null];
	} catch (e) {
		console.log(e);
		return [null, {
			code: 500,
			message: "Internal Server Error when generating TOTP secret",
		}];
	}
};


