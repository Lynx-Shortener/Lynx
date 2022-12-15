const { current: currentAccount } = require("../../db/modules/account/get");

module.exports = async (req, res, next) => {
	const [account, error] = await currentAccount(req);
	if (error)
		return res.status(error.code).json({
			success: false,
			message: error.message,
		});

	req.account = account;
	next();
};
