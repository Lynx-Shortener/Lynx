const Link = require("../../models/link");

module.exports = async ({ pagesize, page }) => {
	const total = await Link.count();
	const links = await Link.find({}, null, { skip: page * pagesize, limit: pagesize });

	let remaining = Math.ceil((total - page * pagesize) / pagesize) - 1;

	if (remaining < 0) remaining = 0;

	return {
		remaining,
		links,
	};
};
