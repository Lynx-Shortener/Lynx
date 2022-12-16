const express = require("express");
const router = express.Router();
const { list, get, create, update, remove } = require("../db/modules/link");
const returnLink = require("../modules/returnLink");
const requireFields = require("./middleware/requireFields");
const requireLogin = require("./middleware/requireLogin");

router.get("/list", requireLogin, requireFields(["pagesize", "page", "sort"], "query"), async function (req, res) {
	try {
		const { pagesize, page, sort } = req.query;
		if (pagesize > 100)
			return res.status(400).json({
				success: false,
				message: "Pagesize limit is 100 items",
			});

		const data = await list({ pagesize, page, sort });

		data.links = data.links.map((link) => returnLink(link));

		res.status(200).json({
			success: true,
			result: data,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when listing links",
		});
	}
});

router.get("/", requireFields(["slug"], "query"), async function (req, res) {
	try {
		const { slug } = req.query;
		const data = await get(
			{
				slug,
			},
			null,
			true
		);

		if (data) {
			res.status(200).json({
				success: true,
				result: {
					destination: data.destination,
				},
			});
		} else {
			res.status(404).json({
				success: false,
				message: "invalid link",
			});
		}
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when getting link",
		});
	}
});

router.post("/", requireLogin, requireFields(["slug", "destination"]), async function (req, res) {
	try {
		const { slug, destination } = req.body;

		const [link, linkError] = await create({
			author: req.account.id,
			slug,
			destination,
		});

		if (linkError)
			return res.status(linkError.code).json({
				success: false,
				message: linkError.message,
			});

		return res.status(200).json({
			success: true,
			result: returnLink(link),
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when creating link",
		});
	}
});

router.patch("/", requireLogin, requireFields(["slug", "destination", "id"]), async function (req, res) {
	try {
		const { slug, destination, id } = req.body;

		const [link, linkError] = await update({
			id,
			slug,
			destination,
		});

		if (linkError)
			return res.status(linkError.code).json({
				success: false,
				message: linkError.message,
			});

		return res.status(200).json({
			success: true,
			result: returnLink(link),
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when updating link",
		});
	}
});

router.delete("/", requireLogin, requireFields(["ids"]), async function (req, res) {
	try {
		const { ids } = req.body;

		const [link, deleteError] = await remove({
			ids,
		});

		if (deleteError)
			return res.status(deleteError.code).json({
				success: false,
				message: deleteError.message,
			});

		return res.status(200).json({
			success: true,
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error when deleting link",
		});
	}
});

module.exports = router;
