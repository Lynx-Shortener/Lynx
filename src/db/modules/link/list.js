const Link = require("../../models/link");

module.exports = async ({ pagesize, page, sort }) => {
	const total = await Link.count();
	const links = await Link.find({}, null, {
		skip: page * pagesize,
		limit: pagesize,
		sort: {
			creationDate: sort === "desc" ? -1 : 1,
		},
	});

	let remaining = Math.ceil((total - page * pagesize) / pagesize) - 1;

	if (remaining < 0) remaining = 0;

	return {
		remaining,
		links,
	};
};
