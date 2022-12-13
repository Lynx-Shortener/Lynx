const Link = require("../../models/link");

module.exports = async ({ id }) => {
	try {
		await Link.deleteOne({ id });
		return [true, null];
	} catch {
		return [
			null,
			{
				code: 500,
				message: "Internal Server Error when deleting Link",
			},
		];
	}
};
