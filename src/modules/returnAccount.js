module.exports = ({
    id, username, email, role, secret, totp: { enabled: totp }, quota,
}) => ({
    id,
    username,
    email,
    role,
    secret,
    totp,
    quota,
});
