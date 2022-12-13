const getLink = require("./get");

module.exports = async ({ id, slug, destination }) => {
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

	if (await getLink({ slug }, id))
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

	return [link, null];
};
