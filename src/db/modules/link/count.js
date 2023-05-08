const Link = require("../../models/link");

module.exports = async () => {
	return await Link.count();
};
