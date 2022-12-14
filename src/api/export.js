const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Link = require("../db/models/link");
const { current: currentAccount } = require("../db/modules/account/get");
const returnLink = require("../modules/returnLink");
const { v4: uuid4 } = require("uuid");

router.post("/", async (req, res) => {
	const [account, error] = await currentAccount(req);
	if (error) return res.status(error.code).send(error.message);

	const { type: exportType } = req.body;

	let links = await Link.find();
	links = links.map((link) => returnLink(link));

	let exported;

	if (exportType === "json") {
		exported = {
			data: JSON.stringify(links),
			mimetype: "text/json",
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
			mimetype: "text/csv",
			filetype: "json",
		};
	}

	res.writeHead(200, {
		"Content-Type": exported.mimetype,
		"Content-disposition": `attachment;filename=export-${uuid4()}.${exported.filetype}`,
		"Content-Length": exported.data.length,
	});

	res.end(Buffer.from(exported.data, "binary"));
});

module.exports = router;
