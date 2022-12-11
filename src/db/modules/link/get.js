const Link = require("../../models/link");

module.exports = async ({ slug, destination, id }) => {
	if (slug) return await Link.findOne({ slug });
	if (destination) return await Link.findOne({ destination });
	if (id) return await Link.findOne({ id });
};
