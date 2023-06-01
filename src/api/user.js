const express = require("express");
const router = express.Router();
const requireFields = require("./middleware/requireFields");
const requireTOTP = require("./middleware/requireTOTP");
const requireAccountValue = require("./middleware/requireAccountValue");
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

router.post("/role", requireAccountValue({ role: ["owner"] }), async (req, res) => {
	try {
		const { role, userID } = req.body;

		if (!["admin", "owner", "standard"].includes(role))
			return res.status(417).json({
				success: false,
				message: "Invalid role",
			});

		const [user, userError] = await account.get.byID({ id: userID });

		if (!user)
			return res.status(userError.code).json({
				success: false,
				message: userError.message,
			});

		const [updatedUser, updatedUserError] = await account.update.role({ account: user, role });

		if (!updatedUser)
			return res.status(updatedUserError.code).json({
				success: false,
				message: updatedUserError.message,
			});

		res.status(200).json({
			success: true,
			result: {
				user: updatedUser,
			},
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
