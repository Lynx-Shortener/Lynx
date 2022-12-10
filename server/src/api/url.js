const express = require("express");
const router = express.Router();
const { list } = require("../db/modules/url");

router.get("/list", async function (req, res) {
	const { pagesize, page } = req.query;
	const result = await list({ pagesize, page });

	res.status(200).json({
		success: true,
		result,
	});
});

module.exports = router;
