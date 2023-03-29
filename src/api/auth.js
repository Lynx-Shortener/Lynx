const express = require("express");
const router = express.Router();
const requireFields = require("./middleware/requireFields");
const requireLogin = require("./middleware/requireLogin");
const countAccounts = require("../db/modules/account/count");
const createSecret = require("../db/modules/secret/create");
const cookie = require("cookie");

const {
	login,
	get: { current: currentAccount },
	update: { email: updateEmail, password: updatePassword, username: updateUsername },
	register,
} = require("../db/modules/account");

router.post("/login", requireFields(["username", "password"]), async (req, res) => {
	try {
		const { username, password } = req.body;

		const [data, error] = await login({
			username,
			password,
		});

		if (error)
			return res.status(error.code).json({
				success: false,
				message: error.message,
			});

		res.setHeader("Set-Cookie", data.serialized);

		return res.status(200).json({
			success: true,
			message: "Successfully logged in!"
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when logging in",
		});
	}
});

router.delete("/me", requireLogin, async (req, res) => {
	const serialized = cookie.serialize('token', null, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: -1,
		path: '/',
	});

	res.setHeader('Set-Cookie', serialized);

	res.status(200).json({
		success: true,
		message: "Successfully logged out"
	});
})

router.post("/register", requireFields(["email", "username", "password"]), async (req, res) => {
	const accountsCount = await countAccounts();
	if ((accountsCount !== 0 && process.env.ENABLE_REGISTRATION !== "true") || process.env.DEMO == "true")
		return res.status(412).json({
			success: false,
			message: "Registration is not enabled",
		});
	try {
		const { email, username, password } = req.body;

		const [data, error] = await register({
			email,
			username,
			password,
			role: accountsCount === 0 ? "admin" : "standard",
		});

		if (error)
			return res.status(error.code).json({
				success: false,
				message: error.message,
				details: error.details,
			});

		return res.status(200).json({
			success: true,
			result: data,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when registering",
		});
	}
});

router.get("/me", async (req, res) => {
	try {
		const [account, error] = await currentAccount(req);
		if (error) return res.status(error.code).send(error.message);

		const { email, id, username, role, secret } = account;

		return res.status(200).send({
			success: true,
			result: {
				email,
				id,
				username,
				role,
				secret,
			},
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when getting current account",
		});
	}
});

router.patch("/email", requireFields(["newEmail", "password"]), async (req, res) => {
	if (process.env.DEMO === "true")
		return res.status(406).json({
			success: false,
			message: "Updating of credentials is not enabled in demo mode.",
		});
	try {
		const [account, accountError] = await currentAccount(req);
		if (accountError) return res.status(accountError.code).send(accountError.message);

		const { newEmail, password } = req.body;

		const [updateResponse, updateError] = await updateEmail({
			account,
			newEmail,
			password,
		});

		if (updateError)
			return res.status(updateError.code).json({
				success: false,
				message: updateError.message,
			});

		return res.status(200).json({
			success: true,
			result: updateResponse,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when updating email",
		});
	}
});

router.patch("/password", requireFields(["password", "newPassword"]), async (req, res) => {
	if (process.env.DEMO === "true")
		return res.status(406).json({
			success: false,
			message: "Updating of credentials is not enabled in demo mode.",
		});
	try {
		const [account, accountError] = await currentAccount(req);
		if (accountError) return res.status(accountError.code).send(accountError.message);

		const { password, newPassword } = req.body;

		const [updateResponse, updateError] = await updatePassword({
			account,
			password,
			newPassword,
		});

		if (updateError)
			return res.status(updateError.code).json({
				success: false,
				message: updateError.message,
			});

		return res.status(200).json({
			success: true,
			result: updateResponse,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when updating password",
		});
	}
});

router.patch("/username", requireFields(["newUsername", "password"]), async (req, res) => {
	if (process.env.DEMO === "true")
		return res.status(406).json({
			success: false,
			message: "Updating of credentials is not enabled in demo mode.",
		});
	try {
		const [account, accountError] = await currentAccount(req);
		if (accountError) return res.status(accountError.code).send(accountError.message);

		const { newUsername, password } = req.body;

		const [updateResponse, updateError] = await updateUsername({
			account,
			newUsername,
			password,
		});

		if (updateError)
			return res.status(updateError.code).json({
				success: false,
				message: updateError.message,
			});

		return res.status(200).json({
			success: true,
			result: updateResponse,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when updating username",
		});
	}
});

router.post("/newSecret", requireLogin, async function (req, res) {
	const secret = await createSecret(req.account);
	return res.status(200).json({
		success: true,
		result: {
			secret,
		},
	});
});

module.exports = router;
