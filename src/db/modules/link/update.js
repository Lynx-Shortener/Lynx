const getLink = require("./get");
const Account = require("../../models/account");

module.exports = async ({ id, slug, destination, account }) => {
	if (!slug)
		return [
			null,
			{
				message: "Invalid slug",
				code: 409,
			},
		];
	if (!destination) {
		return [
			null,
			{
				message: "Invalid destination",
				code: 409,
			},
		];
	}
	let link = await getLink({ id });
	if (!link)
		return [
			null,
			{
				message: "A link with that id does not exist",
				code: 404,
			},
		];

	if (link && account.role !== "admin" && account.id !== link.author)
		return [
			null,
			{
				message: "You do not have the permissions to delete this link",
				code: 403,
			},
		];

	const matchingSlug = await getLink({ slug }, id);
	if (matchingSlug)
		return [
			null,
			{
				message: "A link with that slug already exists",
				code: 409,
			},
		];

	if (process.env.URL_ONLY_UNIQUE === "true") {
		if (await getLink({ destination }, id))
			return [
				null,
				{
					message: "A link with that destination already exists",
					code: 409,
				},
			];
	}

	link.slug = slug;
	link.destination = destination;
	link.modifiedDate = new Date();

	await link.save();

	const linkAuthor = await Account.findOne({ id: link.author });

	link.account = linkAuthor ? linkAuthor.username : "n/a";

	return [link, null];
};
