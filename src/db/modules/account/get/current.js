const jwt = require("jsonwebtoken");
const Account = require("../../../models/account");
require("dotenv").config();

module.exports = async (req, token) => {
	if (!token) {
		const auth = req.headers.authorization;
		if (!auth) return [null, { code: 400, message: "No authorization header" }];
		if (auth.split(" ").length != 2) return [null, { code: 400, message: "Invalid token format" }];
		token = auth.split(" ")[1];
	}

	try {
		const decodedjwt = jwt.verify(token, process.env.JWT_KEY);
		const account = await Account.findOne({ id: decodedjwt.id });
		if (!account) return [null, { code: 401, message: "Invalid authorization token" }];

		return [account, null];
	} catch (err) {
		return [null, { code: 401, message: "Invalid authorization token" }];
	}
};
