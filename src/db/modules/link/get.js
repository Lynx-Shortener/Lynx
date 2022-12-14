const Link = require("../../models/link");

module.exports = async ({ slug, destination, id }, ignoredID, countVisit) => {
	let link;
	if (slug) link = await Link.findOne({ slug, id: { $ne: ignoredID } });
	if (destination) link = await Link.findOne({ destination, id: { $ne: ignoredID } });
	if (id) link = await Link.findOne({ id });

	if (countVisit && link) {
		if (link.visits) link.visits += 1;
		else link.visits = 1;
		await link.save();
		return link;
	}
	return link;
};
