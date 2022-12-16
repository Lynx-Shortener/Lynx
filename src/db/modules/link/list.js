const Link = require("../../models/link");
const Account = require("../../models/account");

module.exports = async ({ pagesize, page, sort }) => {
	const total = await Link.count();
	let links = await Link.find({}, null, {
		skip: page * pagesize,
		limit: pagesize,
		sort: {
			creationDate: sort === "desc" ? -1 : 1,
		},
	});

	links = await Promise.all(
		links.map(async (link) => {
			const account = await Account.findOne({ id: link.author });
			link.account = account ? account.username : "n/a";
			return link;
		})
	);

	let remaining = Math.ceil((total - page * pagesize) / pagesize) - 1;

	if (remaining < 0) remaining = 0;

	return {
		remaining,
		links,
	};
};
