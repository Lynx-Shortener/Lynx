const express = require("express");

const router = express.Router();
const requireLogin = require("./middleware/requireLogin");
const requireAccountValue = require("./middleware/requireAccountValue");

router.use("/auth", require("./auth"));

router.use("/link", require("./link"));

router.use("/import", require("./import"));

router.use("/export", require("./export"));

router.use("/sharex", require("./sharex"));

router.use("/about", require("./about"));

router.use("/user", requireLogin(true), requireAccountValue({ role: ["admin", "owner"] }), require("./user"));

router.get("/", (req, res) => {
    res.send("OK");
});

module.exports = router;
