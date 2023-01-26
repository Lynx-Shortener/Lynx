const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	id: String,
	slug: String,
	destination: String,
	author: String,
	creationDate: Date,
	modifiedDate: Date,
	visits: Number,
	file: {
		id: String,
		size: String,
		extension: String,
	},
});

const Link = mongoose.model("Link", schema);

module.exports = Link;
