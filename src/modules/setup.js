const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = async () => {
	// Remove tmp files

	fs.readdir(path.join("tmp", "uploads"), (err, files) => {
		if (err) throw err;

		for (const file of files) {
			fs.unlink(path.join(path.join("tmp", "uploads"), file), (err) => {
				if (err) throw err;
			});
		}
	});

	return { setupCompleted: true };
};
