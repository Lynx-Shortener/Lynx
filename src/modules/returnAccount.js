module.exports = ({
    id, username, email, role, secret, totp: { enabled: totp }, allowAutomaticLogin,
}) => ({
    id,
    username,
    email,
    role,
    secret,
    totp,
    allowAutomaticLogin,
});
