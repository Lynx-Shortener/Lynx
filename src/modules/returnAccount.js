module.exports = ({
    id, username, email, role, secret, twoFactorAuthentication: { enabled: twoFactorAuthentication, totp: { verified: totp } }, allowAutomaticLogin,
}) => ({
    id,
    username,
    email,
    role,
    secret,
    twoFactorAuthentication,
    totp,
    allowAutomaticLogin,
});
