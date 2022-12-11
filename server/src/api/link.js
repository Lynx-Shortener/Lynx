const express = require("express");
const router = express.Router();
const { list, get } = require("../db/modules/link");

const { current: currentAccount } = require("../db/modules/account/get");

router.get("/list", async function (req, res) {
	const [account, error] = await currentAccount(req);
	if (error) return res.status(error.code).send(error.message);
	const { pagesize, page, sort } = req.query;
	const data = await list({ pagesize, page, sort });

	res.status(200).json({
		success: true,
		result: data,
	});
});

router.get("/", async function (req, res) {
	const { slug } = req.query;
	const data = await get({
		slug,
	});

	if (data) {
		res.status(200).json({
			success: true,
			result: {
				destination: data.destination,
			},
		});
	} else {
		res.status(404).json({
			success: false,
			message: "invalid link",
		});
	}
});

module.exports = router;
