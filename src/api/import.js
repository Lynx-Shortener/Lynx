const express = require("express");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const Link = require("../db/models/link");
const { v4: uuid4 } = require("uuid");
const { current: currentAccount } = require("../db/modules/account/get");

const upload = multer({ dest: "tmp/csv/" });

router.post("/", upload.single("file"), async (req, res) => {
	const [account, error] = await currentAccount(req);
	if (error) return res.status(error.code).send(error.message);
	try {
		const fileData = fs.readFileSync(path.join("tmp", "csv", req.file.filename));
		parse(fileData, { columns: true, trim: true }, async (err, rows) => {
			if (!err) {
				if (req.body.service == "shlink") {
					if (
						["shortUrl", "longUrl", "createdAt", "visits"].filter((requirement) => !Object.keys(rows[0]).includes(requirement)).length !=
						0
					) {
						return res.status(400).json({
							message: "Invalid import fields",
						});
					}
				}
				const slugs = [];
				let links = rows.map((row) => {
					let link = {};
					if (req.body.service == "shlink") {
						link.id = uuid4();
						link.slug = new URL(row.shortUrl).pathname.slice(1);
						link.destination = row.longUrl;
						link.author = account.id;
						link.creationDate = new Date(row.createdAt);
						link.modifiedDate = new Date(row.createdAt);
						link.visits = row.visits;
					}

					slugs.push(link.slug);

					return link;
				});

				const existingSlugs = (
					await Link.find({
						slug: {
							$in: slugs,
						},
					})
				).map((link) => link.slug);

				links = links.filter((link) => !existingSlugs.includes(link.slug));
				await Link.insertMany(links);
				return res.status(200).json({
					success: true,
					message: `Imported ${links.length} / ${rows.length} links!`,
				});
			}
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			message: "Internal Server Error when importing links",
		});
	}
});

module.exports = router;
