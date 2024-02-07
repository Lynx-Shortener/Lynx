const express = require("express");

const router = express.Router();
const multer = require("multer");

const upload = multer();
const Link = require("../db/modules/link");
const requireLogin = require("./middleware/requireLogin");
const getAccountBySecret = require("../db/modules/account/get/bySecret");

const domain = process.env.DOMAIN || "http://localhost:3000";

router.post("/", upload.none(), async (req, res) => {
    const { secret, url } = req.body;

    const [Account, accountError] = await getAccountBySecret({ secret });
    if (accountError) {
        return res.status(accountError.code).json({
            success: false,
            error: accountError.message,
        });
    }

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
        url: `${domain}/${slug}`,
    });
});

router.get("/config", requireLogin(), async (req, res) => {
    const config = {
        Version: "14.1.0",
        Name: "Lynx",
        DestinationType: "Lynx",
        RequestMethod: "POST",
        RequestURL: `${domain}/api/sharex`,
        Body: "MultipartFormData",
        Arguments: {
            secret: req.account.secret,
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
