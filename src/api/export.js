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

	const { format } = req.body;

	let links = await Link.find();
	links = links.map((link) => returnLink(link));

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
});

module.exports = router;
