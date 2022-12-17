const Account = require("../../models/account");
const valid = require("../valid");
const createAccount = require("../account/create");

module.exports = async ({ email, username, password }) => {
	const invalid = {
		email: false,
		username: false,
		password: false,
	};

	invalid.email = !valid.email(email);
	invalid.username = !valid.username(username);
	invalid.password = !valid.password(password);

	if (invalid.password || invalid.username || invalid.email) {
		let invalidFields = Object.keys(invalid).filter((field) => invalid[field]);
		const last = invalidFields.pop();
		let response;
		if (invalidFields.length > 0) {
			response = invalidFields.join(", ") + ` and ${last}`;
		} else {
			response = last;
		}
		return [
			null,
			{
				code: 400,
				message: `Invalid ${response}`,
				details: { invalid },
			},
		];
	}

	const exists = {
		username: false,
		email: false,
	};

	// check if username or email are used
	// replace function escapes any regex
	const usernameRegex = new RegExp(username.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
	exists.username = (await Account.findOne({ username: usernameRegex })) !== null;

	const emailRegex = new RegExp(email.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
	exists.email = (await Account.findOne({ email: emailRegex })) !== null;

	if (exists.email || exists.username) {
		let invalidFields = Object.keys(exists).filter((field) => exists[field]);
		const last = invalidFields.pop();
		let response;
		if (invalidFields.length > 0) {
			response = invalidFields.join(", ") + ` and ${last}`;
		} else {
			response = last;
		}
		return [
			null,
			{
				code: 400,
				message: `${response} are already used`,
				details: { exists },
			},
		];
	}

	const [account, error] = await createAccount({
		username,
		email,
		password,
	});

	if (account) return ["Account created", null];
	if (!error)
		return [
			null,
			{
				code: 500,
				message: "Internal Server Error when registering account",
			},
		];
};
