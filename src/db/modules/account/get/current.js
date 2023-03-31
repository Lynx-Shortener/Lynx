const jwt = require("jsonwebtoken");
const Account = require("../../../models/account");
const cookie = require("cookie");
require("dotenv").config();

module.exports = async (req, token) => {
	
	if (!token) {
		const cookies = cookie.parse(req.headers.cookie || '');
		if (!cookies.token) return [null, { code: 400, message: "No cookie token provided" }];
		token = cookies.token;
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
