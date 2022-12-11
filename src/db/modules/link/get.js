const Link = require("../../models/link");

module.exports = async ({ slug, destination, id }, ignoredID) => {
	if (slug) return await Link.findOne({ slug, id: { $ne: ignoredID } });
	if (destination) return await Link.findOne({ destination, id: { $ne: ignoredID } });
	if (id) return await Link.findOne({ id });
};
