const express = require("express");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const Link = require("../db/models/link");
const { v4: uuid4 } = require("uuid");
const { current: currentAccount } = require("../db/modules/account/get");

const upload = multer({ dest: "tmp/uploads/" });

const fields = {
	shlink: ["shortUrl", "longUrl", "createdAt", "visits"],
	"url-shortener": ["id", "slug", "destination", "author", "creationDate", "modifiedDate", "visits"],
};

const processFile = async (path) => {
	records = [];
	const parser = fs.createReadStream(path).pipe(parse({ columns: true, trim: true }));
	for await (const record of parser) {
		// Work with each record
		records.push(record);
	}
	return records;
};

router.post("/", upload.single("file"), async (req, res) => {
	try {
		const [account, error] = await currentAccount(req);
		if (error) return res.status(error.code).send(error.message);
		const { service } = req.body;

		const filetype = req.file.originalname.split(".").at(-1);
		const allowedFiletypes = ["json", "csv"];
		if (!allowedFiletypes.includes(filetype))
			return res.status(400).json({
				message: "Invalid filetype",
			});
		let links;
		const filepath = path.join("tmp", "uploads", req.file.filename);
		if (filetype == "csv") {
			const rows = await processFile(filepath);
			if (fields[service].filter((requirement) => !Object.keys(rows[0]).includes(requirement)).length != 0) {
				return res.status(400).json({
					message: "Invalid import fields",
				});
			}

			links = rows.map((row) => {
				let link = {};
				if (service == "shlink") {
					link.id = uuid4();
					link.slug = new URL(row.shortUrl).pathname.slice(1);
					link.destination = row.longUrl;
					link.author = account.id;
					link.creationDate = new Date(row.createdAt);
					link.modifiedDate = new Date(row.createdAt);
					link.visits = row.visits;
				} else if (service == "url-shortener") {
					link = row;
				}

				return link;
			});
		} else if (filetype == "json") {
			if (service == "url-shortener") {
				links = JSON.parse(fs.readFileSync(filepath, "utf-8"));
			}
		}

		const slugs = links.map((link) => link.slug);

		const existingSlugs = (
			await Link.find({
				slug: {
					$in: slugs,
				},
			})
		).map((link) => link.slug);

		const originalLinkCount = links.length;

		links = links.filter((link) => !existingSlugs.includes(link.slug));
		await Link.insertMany(links);
		return res.status(200).json({
			success: true,
			message: `Imported ${links.length} / ${originalLinkCount} links!`,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			message: "Internal Server Error when importing links",
		});
	}
});

module.exports = router;
