module.exports = ({
    id, username, email, role, secret, loginMethods, twoFactorAuthentication,
}) => ({
    id,
    username,
    email,
    role,
    secret,
    loginMethods: {
        password: !!loginMethods.password,
        webAuthn: loginMethods.webAuthn,
    },
    twoFactorAuthentication: {
        enabled: twoFactorAuthentication.enabled,
        totp: !!twoFactorAuthentication.totp.enabled,
        webAuthn: {
            authenticators: (twoFactorAuthentication?.authenticators || []).map((authenticator) => ({ name: authenticator.name })),
        },
    },
});
