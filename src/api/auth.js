const express = require("express");
const router = express.Router();

const {
	login,
	get: { current: currentAccount },
	update: { email: updateEmail, password: updatePassword, username: updateUsername },
} = require("../db/modules/account");

router.post("/login", async function (req, res) {
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

		return res.status(200).json({
			success: true,
			result: data,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when logging in",
		});
	}
});

router.get("/me", async function (req, res) {
	try {
		const [account, error] = await currentAccount(req);
		if (error) return res.status(error.code).send(error.message);

		const { email, id, username } = account;

		return res.status(200).send({
			success: true,
			result: {
				email,
				id,
				username,
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

router.patch("/email", async function (req, res) {
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

router.patch("/password", async function (req, res) {
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

router.patch("/username", async function (req, res) {
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

module.exports = router;
