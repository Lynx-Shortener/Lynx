const express = require("express");
const router = express.Router();

const {
	login,
	get: { current: currentAccount },
} = require("../db/modules/account");

router.post("/login", async function (req, res) {
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
});

router.get("/me", async function (req, res) {
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
});

module.exports = router;
