const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	id: String,
	username: String,
	password: String,
	email: String,
	role: String, // admin || standard
	secret: String,
});

const Account = mongoose.model("Account", schema);

module.exports = Account;
