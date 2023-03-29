const Account = require("../../models/account");
const checkPassword = require("../password/check");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
require("dotenv").config("../../../.env");

const getAccountByUsername = async (username) => {
	return await Account.findOne({
		username,
	});
};

const getAccountByEmail = async (email) => {
	return await Account.findOne({
		email,
	});
};

module.exports = async ({ username, password }) => {
	let errors = [];

	if (Object.keys(errors).length !== 0)
		return [
			null,
			{
				message: Object.values(errors).join("\n"),
				code: 400,
			},
		];

	// Username can also be an email
	const account = (await getAccountByUsername(username)) || (await getAccountByEmail(username));
	if (!account)
		return [
			null,
			{
				message: "Invalid username or password",
				code: 403,
			},
		];
	const passwordIsCorrect = checkPassword(password, account?.password);
	if (!passwordIsCorrect)
		return [
			null,
			{
				message: "Invalid username or password",
				code: 403,
			},
		];

	// expire jwt logins in an hour if demo
	const expiresIn = process.env.DEMO === "true" ? "1h" : "7d";

	const token = jwt.sign(
		{
			id: account.id,
		},
		process.env.JWT_KEY,
		{
			algorithm: "HS256",
			expiresIn,
		}
	);

	const serialized = cookie.serialize("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: process.env.DEMO ? 3600 * 1000 : 86400 * 1000 * 7,
		path: "/"
	})

	return [
		{
			serialized,
		},
		null,
	];
};
