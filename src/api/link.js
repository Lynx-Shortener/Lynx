const express = require("express");
const router = express.Router();
const { list, get, create } = require("../db/modules/link");

const { current: currentAccount } = require("../db/modules/account/get");

const returnLink = ({ id, slug, destination, author, creationDate, modifiedDate }) => {
	return {
		id,
		slug,
		destination,
		author,
		creationDate,
		modifiedDate,
	};
};

router.get("/list", async function (req, res) {
	const [account, error] = await currentAccount(req);
	if (error) return res.status(error.code).send(error.message);
	const { pagesize, page, sort } = req.query;
	if (pagesize > 100)
		return res.status(400).json({
			success: false,
			message: "Pagesize limit is 100 items",
		});
	const data = await list({ pagesize, page, sort });

	res.status(200).json({
		success: true,
		result: data,
	});
});

router.get("/", async function (req, res) {
	const { slug } = req.query;
	const data = await get({
		slug,
	});

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
});

router.post("/", async function (req, res) {
	const [account, accountError] = await currentAccount(req);
	if (accountError) return res.status(accountError.code).send(accountError.message);
	const { slug, destination } = req.body;

	const [link, linkError] = await create({
		author: account.id,
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
});

module.exports = router;
