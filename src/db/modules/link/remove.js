const Link = require("../../models/link");

module.exports = async ({ ids }) => {
	try {
		await Link.deleteMany({
			id: {
				$in: ids,
			},
		});
		return [true, null];
	} catch (e) {
		console.log(e);
		return [
			null,
			{
				code: 500,
				message: "Internal Server Error when deleting Link",
			},
		];
	}
};
