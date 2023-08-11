const fs = require("fs");
const express = require("express");
const requireLogin = require("./middleware/requireLogin");

const router = express.Router();
const countAccounts = require("../db/modules/account/count");
const countLinks = require("../db/modules/link/count");

router.get("/", requireLogin(false, true), async (req, res) => {
    const result = {
        domain: process.env.DOMAIN || "http://example.com",
        demo: process.env.DEMO === "true",
    };

    if (req.account) {
        if (fs.existsSync("VERSION")) {
            let version = fs.readFileSync("VERSION", { encoding: "utf8", flag: "r" });
            version = version.replace(/\r|\n/g, "");
            result.version = version;
        }

        if (req.account.role === "standard") {
            const linkCount = await countLinks({ author: req.account.id });
            result.links = linkCount;
        } else {
            const accountCount = await countAccounts();
            result.accounts = accountCount;

            const linkCount = await countLinks();
            result.links = linkCount;
        }
    }

    if (process.env.UMAMI_SITEID && process.env.UMAMI_URL) {
        result.umami = {
            site: process.env.UMAMI_SITEID,
            url: process.env.UMAMI_URL,
        };
    }

    res.status(200).json({
        success: true,
        result,
    });
});

module.exports = router;
