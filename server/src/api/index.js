const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.js"));

router.get("/", function (req, res) {
	res.send("OK");
});

module.exports = router;
