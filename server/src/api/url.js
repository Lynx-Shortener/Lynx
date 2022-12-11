const express = require("express");
const router = express.Router();
const { list } = require("../db/modules/url");

const { current: currentAccount } = require("../db/modules/account/get");

router.get("/list", async function (req, res) {
	const [account, error] = await currentAccount(req);
	if (error) return res.status(error.code).send(error.message);
	const { pagesize, page } = req.query;
	const result = await list({ pagesize, page });

	res.status(200).json({
		success: true,
		result,
	});
});

module.exports = router;
