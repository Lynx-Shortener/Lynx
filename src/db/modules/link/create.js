const Link = require("../../models/link");
const Account = require("../../models/link");
const { v4: uuid4 } = require("uuid");
const getLink = require("./get");
const { url: validUrl } = require("../valid");

const chars = {
	alpha: "abcdefghijklmnopqrstuvwxyz",
	numeric: "0123456789",
};

const generateSlug = () => {
	let charset;
	switch (process.env.URL_SET) {
		case "standard":
			charset = chars.alpha.toLowerCase() + chars.alpha.toUpperCase() + chars.numeric;
			break;

		case "lower":
			charset = chars.alpha.toLowerCase();
			break;
	}

	return [...new Array(parseInt(process.env.URL_LENGTH))].map((_) => charset[Math.floor(Math.random() * charset.length)]).join("");
};

module.exports = async ({ author, slug, destination }) => {
	if (!validUrl(destination)) {
		return [
			null,
			{
				message: "Invalid destination url format",
				code: 422,
			},
		];
	}

	if (!slug || slug === "") {
		let slugUnique;
		while (!slugUnique) {
			slug = generateSlug();
			const existingLink = await getLink({ slug });
			if (!existingLink) slugUnique = true;
		}
	} else {
		const existingLink = await getLink({ slug });
		if (existingLink)
			return [
				null,
				{
					message: "A link with that slug already exists",
					code: 409,
				},
			];
	}

	if (process.env.URL_ONLY_UNIQUE === "true") {
		const existingLink = await getLink({ destination });
		if (existingLink)
			return [
				null,
				{
					message: "A link with that destination already exists",
					code: 409,
				},
			];
	}

	const link = new Link({
		id: uuid4(),
		slug,
		destination,
		author: author.id,
		creationDate: new Date(),
		modifiedDate: new Date(),
		visits: 0,
	});

	await link.save();

	link.account = author.username;

	return [link, null];
};
