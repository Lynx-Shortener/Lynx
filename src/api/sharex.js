const express = require("express");
const router = express.Router();
const multer = require("multer");
const account = require("../db/modules/account");
const upload = multer();
const Link = require("../db/modules/link");
const requireLogin = require("./middleware/requireLogin");

const getAccountDirectly = async (req, res, { username, password }) => {
	const [loginData, loginError] = await account.login({ username, password });
	if (loginError) {
		res.status(loginError.code).json({
			success: false,
			error: loginError.message,
		});
		return;
	}

	const [Account, AccountError] = await account.get.current(null, loginData.token);
	if (AccountError) {
		res.status(500).json({
			success: false,
			error: "Login successful but authentication unsuccessful",
		});
		return;
	}

	return Account;
};

router.post("/", upload.none(), async (req, res) => {
	const { url } = req.body;

	const Account = await getAccountDirectly(req, res, req.body);
	if (!Account) return;

	const [link, linkError] = await Link.create({
		author: Account,
		destination: url,
	});

	if (linkError) {
		return res.status(linkError.code).json({
			success: false,
			error: linkError.message,
		});
	}

	const { slug } = link;

	res.status(200).json({
		success: true,
		url: slug,
		deletion: `/api/sharex/delete/${slug}`,
	});
});

router.get("/config", requireLogin, async (req, res) => {
	const domain = process.env.DOMAIN || "http://localhost:3000";
	const config = {
		Version: "14.1.0",
		Name: "Lynx",
		DestinationType: "Lynx",
		RequestMethod: "POST",
		RequestURL: `${domain}/api/sharex`,
		Body: "MultipartFormData",
		Arguments: {
			username: req.account.username,
			password: "PASSWORD",
			url: "{input}",
		},
		URL: "{json:url}",
		ErrorMessage: "{json:error}",
	};

	res.status(200).json({
		success: true,
		result: {
			config,
		},
	});
});

module.exports = router;
