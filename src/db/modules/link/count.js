const Link = require("../../models/link");

module.exports = async (query) => Link. countDocuments(query);
