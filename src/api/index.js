const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.js"));

router.use("/link", require("./link.js"));

router.use("/import", require("./import.js"));

router.get("/", function (req, res) {
	res.send("OK");
});

module.exports = router;
