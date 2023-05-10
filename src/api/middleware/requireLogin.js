const { current: currentAccount, bySecret: getAccountBySecret } = require("../../db/modules/account/get");

module.exports = (disallowSecret, softFail) => {
	return async (req, res, next) => {
		let account;
		let error;

		if (req.body.secret || (req.headers.authorization && !req.headers.authorization.startsWith("Bearer"))) {
			if (disallowSecret) {
				return res.status(403).json({
					success: false,
					message: "You cannot use this endpoint with your API secret",
				});
			}

			[account, error] = await getAccountBySecret({
				secret: req.body.secret || req.headers.authorization,
			});
		} else {
			[account, error] = await currentAccount(req);
		}

		if (error && !softFail)
			return res.status(error.code).json({
				success: false,
				message: error.message,
			});

		if (!error) req.account = account;

		next();
	};
};
