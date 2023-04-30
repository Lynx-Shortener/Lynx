module.exports = ({ id, username, email, role, secret, totp: { enabled: totp } }) => {
	return {
		id,
		username,
		email,
		role,
		secret,
		totp,
	};
};
