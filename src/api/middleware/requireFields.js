module.exports = (fields, fieldLocation) => {
	return function (req, res, next) {
		const unmetFields = fields.filter((field) => !Object.keys(req[fieldLocation || "body"]).includes(field));
		if (unmetFields.length !== 0) {
			return res.status(400).json({
				success: false,
				message: `The following required fields were not included in the request: ${unmetFields.join(", ")}`,
			});
		} else {
			next();
		}
	};
};
