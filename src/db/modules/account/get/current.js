const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const Account = require("../../../models/account");
require("dotenv").config();

module.exports = async (req, token) => {
    let jwtToken;
    if (token) {
        jwtToken = token;
    } else {
        const cookies = cookie.parse(req.headers.cookie || "");
        if (!cookies.token) return [null, { code: 400, message: "No cookie token provided" }];
        jwtToken = cookies.token;
    }

    try {
        const decodedjwt = jwt.verify(jwtToken, process.env.JWT_KEY);
        const account = await Account.findOne({ id: decodedjwt.id });
        if (!account) return [null, { code: 401, message: "Invalid authorization token" }];

        return [account, null];
    } catch (err) {
        return [null, { code: 401, message: "Invalid authorization token" }];
    }
};
