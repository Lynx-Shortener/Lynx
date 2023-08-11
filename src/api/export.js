const express = require("express");

const router = express.Router();
const { v4: uuid4 } = require("uuid");
const Link = require("../db/models/link");
const returnLink = require("../modules/returnLink");
const requireFields = require("./middleware/requireFields");
const requireLogin = require("./middleware/requireLogin");

router.post("/", requireLogin(), requireFields(["format"]), async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Exports are not enabled in demo mode.",
        });
    }
    try {
        const { format } = req.body;

        let links = await Link.find();
        links = links.map((link) => returnLink(link));

        if (!["owner", "admin"].includes(req.account.role)) links = links.filter((link) => link.author === req.account.id);

        let exported;

        if (format === "json") {
            exported = {
                data: JSON.stringify(links),
                filetype: "json",
            };
        } else {
            // https://stackoverflow.com/a/31536517/16367360
            const items = links;
            const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
            const header = Object.keys(items[0]);
            const csv = [
                header.join(","), // header row first
                ...items.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(",")),
            ].join("\r\n");
            //

            exported = {
                data: csv,
                filetype: "csv",
            };
        }

        const buffer = Buffer.from(exported.data);

        res.status(200).json({
            success: true,
            result: {
                buffer,
                filename: `export-${uuid4()}.${exported.filetype}`,
            },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when exporting data",
        });
    }
});

module.exports = router;
