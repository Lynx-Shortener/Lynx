const express = require("express");
const router = express.Router();
const requireFields = require("./middleware/requireFields");
const requireTOTP = require("./middleware/requireTOTP");
const account = require("../db/modules/account");

router.get("/list", async (req, res) => {
	try {
		const accounts = await account.get.all();
		res.status(200).json({
			success: true,
			result: accounts,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when listing users",
		});
	}
});

module.exports = router;
