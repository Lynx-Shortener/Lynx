module.exports = (object) => {
	return async (req, res, next) => {
		const account = req.account;

		const humanFields = [];

		const invalidFields = Object.keys(object).filter((key) => {
			if (account[key] !== object[key]) {
				humanFields.push(`${key}: ${object[key]}`);

				return true;
			}
		});

		if (invalidFields.length >= 1)
			return res.status(412).json({
				success: false,
				message: `Currently logged-in account does not match ${humanFields.join(",")}`,
			});

		next();
	};
};
