const Link = require("../../models/link");

module.exports = async (query) => {
	return await Link.count(query);
};
