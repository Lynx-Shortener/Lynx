const URL = require("../../models/url");
const { v4: uuid4 } = require("uuid");
const getURL = require("./get");

const chars = {
	alpha: "abcdefghijklmnopqrstuvwxyz",
	numeric: "0123456789",
};

function generateSlug() {
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
}

module.exports = async ({ author, slug, destination }) => {
	if (!slug) {
		let urlUnique;
		while (!urlUnique) {
			slug = generateSlug();
			const existingURL = await getURL({ slug });
			if (!existingURL) urlUnique = true;
		}
	} else {
		const existingURL = await getURL({ slug });
		if (existingURL)
			return [
				null,
				{
					message: "A URL with that slug already exists",
					code: 409,
				},
			];
	}

	if (process.env.URL_ONLY_UNIQUE === "true") {
		const existingURL = await getURL({ destination });
		if (existingURL)
			return [
				null,
				{
					message: "A URL with that destination already exists",
					code: 409,
				},
			];
	}

	const url = new URL({
		id: uuid4(),
		slug,
		destination,
		author,
		uses: 0,
		creationDate: new Date(),
		modifiedDate: new Date(),
	});

	await url.save();

	return [url, null];
};
