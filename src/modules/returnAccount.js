module.exports = ({
    id, username, email, role, secret, totp: { enabled: totp },
}) => ({
    id,
    username,
    email,
    role,
    secret,
    totp,
});
