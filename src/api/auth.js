const express = require("express");
const router = express.Router();
const requireFields = require("./middleware/requireFields");
const requireLogin = require("./middleware/requireLogin");
const countAccounts = require("../db/modules/account/count");
const createSecret = require("../db/modules/secret/create");
const cookie = require("cookie");
const totp = require("../db/modules/totp");

const {
	login,
	update: { email: updateEmail, password: updatePassword, username: updateUsername },
	register,
} = require("../db/modules/account");

const randomString = (length) => {
	let alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97)).join("");
	let characters = []
		.concat(
			alphabet.split(""),
			alphabet.toUpperCase().split(""),
			[...Array(26)].map((_, i) => i + 1)
		)
		.join("");

	return [...Array(length)].map(() => characters.at(Math.floor(Math.random() * characters.length))).join("");
};

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
			message: "Successfully logged in!",
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when logging in",
		});
	}
});

// Logout
router.delete("/me", requireLogin(true), async (req, res) => {
	const serialized = cookie.serialize("token", null, {
		httpOnly: true,
		secure: process.env.USE_HTTPS === "true",
		sameSite: "strict",
		maxAge: -1,
		path: "/",
	});

	res.setHeader("Set-Cookie", serialized);

	res.status(200).json({
		success: true,
		message: "Successfully logged out",
	});
});

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

router.get("/me", requireLogin(), async (req, res) => {
	try {
		const { email, id, username, role, secret } = req.account;

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

router.patch("/email", requireLogin(true), requireFields(["newEmail", "password"]), async (req, res) => {
	if (process.env.DEMO === "true")
		return res.status(406).json({
			success: false,
			message: "Updating of credentials is not enabled in demo mode.",
		});
	try {
		const account = req.account;

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

router.patch("/password", requireLogin(true), requireFields(["password", "newPassword"]), async (req, res) => {
	if (process.env.DEMO === "true")
		return res.status(406).json({
			success: false,
			message: "Updating of credentials is not enabled in demo mode.",
		});
	try {
		const account = req.account;

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

router.patch("/username", requireLogin(true), requireFields(["newUsername", "password"]), async (req, res) => {
	if (process.env.DEMO === "true")
		return res.status(406).json({
			success: false,
			message: "Updating of credentials is not enabled in demo mode.",
		});
	try {
		const account = req.account;

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

router.post("/newSecret", requireLogin(true), async function (req, res) {
	const secret = await createSecret(req.account);
	return res.status(200).json({
		success: true,
		result: {
			secret,
		},
	});
});

// Get new TOTP token, if it doesn't already exist.
router.get("/totp", requireLogin(true), async function (req, res) {
	if (req.account?.totp?.enabled === true)
		return res.status(412).json({
			success: false,
			message: "2FA already enabled",
		});

	const [secret, totpCreationFailure] = totp.create();
	if (totpCreationFailure)
		return res.status(totpCreationFailure.code).json({
			success: false,
			message: totpCreationFailure.message,
		});

	req.account.totp = {
		secret,
		enabled: false,
	};

	await req.account.save();

	res.status(200).json({
		success: true,
		message: "TOTP secret successfully generated",
		result: {
			secret,
		},
	});
});

router.post("/totp", requireLogin(true), requireFields(["token"]), async function (req, res) {
	if (!req.account?.totp?.secret)
		return res.status(412).json({
			success: false,
			message: "2FA process hasn't been started",
		});

	if (req.account?.totp?.enabled === true)
		return res.status(412).json({
			success: false,
			message: "2FA already enabled, no need to verify",
		});

	if (typeof req.body.token !== "string" || req.body.token.length != 6)
		return res.status(412).json({
			success: false,
			message: "Invalid token format",
		});

	const [totpVerificationSuccess, totpVerificationFailure] = totp.verify(req.account.username, req.account.totp.secret, req.body.token);

	if (totpVerificationFailure)
		return res.status(totpVerificationFailure.code).json({
			success: false,
			message: totpVerificationFailure.message,
		});

	const backupCodes = [...Array(6)].map(() => randomString(12));

	req.account.totp = {
		secret: req.account.totp.secret,
		backupCodes,
		enabled: true,
	};

	await req.account.save();

	res.status(200).json({
		success: true,
		message: "2FA successfully enabled",
		result: {
			backupCodes,
		},
	});
});


router.post("/totp/recover", requireFields(["backupCode", "username", "password"]), async function (req, res) {
	const { username, password, backupCode } = req.body;

	const [data, error] = await login({
		username,
		password,
	});

	if (error)
		return res.status(error.code).json({
			success: false,
			message: error.message,
		});

	const account = data.account;

	if (!account.totp.enabled)
		return res.status(412).json({
			success: false,
			message: "2FA is not enabled",
		});

	if (!account.totp.backupCodes.includes(backupCode))
		return res.status(403).json({
			success: false,
			message: "Invalid backup code",
		});

	account.totp.enabled = false;
	account.totp.backupCodes = [];
	account.totp.secret = null;
	account.save();

	res.setHeader("Set-Cookie", data.serialized);

	res.json({
		success: true,
		message: "2FA has been disabled and you have been logged in",
	});
});

module.exports = router;
