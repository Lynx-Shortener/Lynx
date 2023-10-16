const express = require("express");
const { generateAuthenticationOptions, verifyAuthenticationResponse } = require("@simplewebauthn/server");
const { isoBase64URL, isoUint8Array } = require("@simplewebauthn/server/helpers");

const router = express.Router();
const requireFields = require("./middleware/requireFields");
const requireLogin = require("./middleware/requireLogin");
const requireTOTP = require("./middleware/requireTOTP");
const countAccounts = require("../db/modules/account/count");
const createSecret = require("../db/modules/secret/create");
const totp = require("../db/modules/totp");
const returnAccount = require("../modules/returnAccount");
const getAccountById = require("../db/modules/account/get/byID");

const {
    login,
    update: { email: updateEmail, password: updatePassword, username: updateUsername },
    register,
} = require("../db/modules/account");
const Account = require("../db/models/account");

const origin = process.env.DOMAIN;
const rpID = origin.match(/(?:(localhost:\d+)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+)|([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}))(?::\d+)?/)[0];

const randomString = (length) => {
    const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97)).join("");
    const characters = []
        .concat(
            alphabet.split(""),
            alphabet.toUpperCase().split(""),
            [...Array(26)].map((_, i) => i + 1),
        )
        .join("");

    return [...Array(length)].map(() => characters.at(Math.floor(Math.random() * characters.length))).join("");
};

router.post("/login", requireFields(["username", "password"]), async (req, res) => {
    try {
        const {
            username, password, token, webAuthnResponse,
        } = req.body;

        const [data, loginError] = await login({
            username,
            password,
        });

        if (loginError) {
            return res.status(loginError.code).json({
                success: false,
                message: loginError.message,
            });
        }

        if (data.account.totp.enabled) {
            if (webAuthnResponse) {
                const authenticator = data.account.webauthn.authenticators.find((authenticator) => isoUint8Array.areEqual(authenticator.id, isoBase64URL.toBuffer(webAuthnResponse.rawId)));

                if (!authenticator) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid authenticator for this user",
                    });
                }

                let verification;

                try {
                    verification = await verifyAuthenticationResponse({
                        response: webAuthnResponse,
                        expectedChallenge: data.account.webauthn.lastChallenge,
                        expectedOrigin: origin,
                        expectedRPID: rpID,
                        authenticator,
                    });
                } catch (error) {
                    console.log(error);

                    return res.status(400).json({
                        success: false,
                        message: error,
                    });
                }

                if (verification.verified) {
                    await Account.findOneAndUpdate(
                        { "webauthn.authenticators": { $elemMatch: { _id: authenticator._id } } },
                        { $set: { "webauthn.authenticators.$.counter": verification.authenticationInfo.newCounter } },
                    );

                    res.setHeader("Set-Cookie", data.serialized);

                    return res.status(200).json({
                        success: true,
                        message: "Successfully logged in!",
                    });
                }
            } if (token) {
                const totpVerificationFailure = totp.verify(username, data.account.totp.secret, token)[1];

                if (totpVerificationFailure) {
                    return res.status(totpVerificationFailure.code).json({
                        success: false,
                        message: totpVerificationFailure.message,
                    });
                }
            } else {
                const accountAuthenticators = data.account.webauthn.authenticators;
                const options = await generateAuthenticationOptions({
                    allowCredentials: accountAuthenticators.map((authenticator) => ({
                        id: new Uint8Array(authenticator.id),
                        type: "public-key",
                    })),
                    userVerification: true,
                });

                await Account.findOneAndUpdate({ id: data.account.id }, { $set: { "webauthn.lastChallenge": options.challenge } });

                return res.status(403).json({
                    success: false,
                    message: "2FA required",
                    result: {
                        webAuthnOptions: options,
                    },
                });
            }
        }

        res.setHeader("Set-Cookie", data.serialized);

        return res.status(200).json({
            success: true,
            message: "Successfully logged in!",
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when logging in",
        });
    }
});

// Logout
router.delete("/me", requireLogin(true), async (req, res) => {
    res.clearCookie("token", { httpOnly: true });

    res.status(200).json({
        success: true,
        message: "Successfully logged out",
    });
});

router.post("/register", requireFields(["email", "username", "password"]), async (req, res) => {
    const accountsCount = await countAccounts();
    if ((accountsCount !== 0 && process.env.ENABLE_REGISTRATION !== "true") || process.env.DEMO === "true") {
        return res.status(412).json({
            success: false,
            message: "Registration is not enabled",
        });
    }
    try {
        const { email, username, password } = req.body;

        const [data, error] = await register({
            email,
            username,
            password,
            role: accountsCount === 0 ? "owner" : "standard",
        });

        if (error) {
            return res.status(error.code).json({
                success: false,
                message: error.message,
                details: error.details,
            });
        }

        return res.status(200).json({
            success: true,
            result: data,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when registering",
        });
    }
});

router.get("/me", requireLogin(), async (req, res) => {
    try {
        const account = returnAccount(req.account);

        return res.status(200).send({
            success: true,
            result: account,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when getting current account",
        });
    }
});

router.patch("/email", requireLogin(true), requireFields(["newEmail", "password"]), requireTOTP, async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Updating of credentials is not enabled in demo mode.",
        });
    }
    try {
        const { account } = req;

        const { newEmail, password } = req.body;

        const [updateResponse, updateError] = await updateEmail({
            account,
            newEmail,
            password,
        });

        if (updateError) {
            return res.status(updateError.code).json({
                success: false,
                message: updateError.message,
            });
        }

        return res.status(200).json({
            success: true,
            result: updateResponse,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when updating email",
        });
    }
});

router.patch("/password", requireLogin(true), requireFields(["password", "newPassword"]), requireTOTP, async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Updating of credentials is not enabled in demo mode.",
        });
    }
    try {
        const { account } = req;

        const { password, newPassword } = req.body;

        const [updateResponse, updateError] = await updatePassword({
            account,
            password,
            newPassword,
        });

        if (updateError) {
            return res.status(updateError.code).json({
                success: false,
                message: updateError.message,
            });
        }

        return res.status(200).json({
            success: true,
            result: updateResponse,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when updating password",
        });
    }
});

router.patch("/username", requireLogin(true), requireFields(["newUsername", "password"]), requireTOTP, async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Updating of credentials is not enabled in demo mode.",
        });
    }
    try {
        const { account } = req;

        const { newUsername, password } = req.body;

        const [updateResponse, updateError] = await updateUsername({
            account,
            newUsername,
            password,
        });

        if (updateError) {
            return res.status(updateError.code).json({
                success: false,
                message: updateError.message,
            });
        }

        return res.status(200).json({
            success: true,
            result: updateResponse,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when updating username",
        });
    }
});

router.post("/newSecret", requireLogin(true), async (req, res) => {
    const { userID } = req.body;

    const permissions = {
        owner: ["admin", "standard"],
        admin: ["standard"],
    };

    let accountToUpdate;

    if (userID && userID !== req.account.id) {
        if (!["owner", "admin"].includes(req.account.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update users.",
            });
        }

        const [specifiedAccount, error] = await getAccountById({ id: userID });
        if (error) {
            return res.status(error.code).json({
                success: false,
                message: error.message,
            });
        }

        if (!permissions[req.account.role].includes(specifiedAccount.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have a high enough role to update this user.",
            });
        }

        accountToUpdate = specifiedAccount;
    } else {
        accountToUpdate = req.account;
    }

    const secret = await createSecret(accountToUpdate);
    return res.status(200).json({
        success: true,
        result: {
            secret,
        },
    });
});

// Get new TOTP token, if it doesn't already exist.
router.get("/totp", requireLogin(true), async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Enabling 2FA is not supported in demo mode.",
        });
    }

    if (req.account?.totp?.enabled === true) {
        return res.status(412).json({
            success: false,
            message: "2FA already enabled",
        });
    }

    const [totpResult, totpCreationFailure] = totp.create(req.account.username);
    if (totpCreationFailure) {
        return res.status(totpCreationFailure.code).json({
            success: false,
            message: totpCreationFailure.message,
        });
    }

    req.account.totp = {
        secret: totpResult.secret,
        enabled: false,
    };

    await req.account.save();

    res.status(200).json({
        success: true,
        message: "TOTP secret successfully generated",
        result: totpResult,
    });
});

router.post("/totp", requireLogin(true), requireFields(["token"]), async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Enabling 2FA is not supported in demo mode.",
        });
    }

    if (!req.account?.totp?.secret) {
        return res.status(412).json({
            success: false,
            message: "2FA process hasn't been started",
        });
    }

    if (req.account?.totp?.enabled === true) {
        return res.status(412).json({
            success: false,
            message: "2FA already enabled, no need to verify",
        });
    }

    if (typeof req.body.token !== "string" || req.body.token.length !== 6) {
        return res.status(412).json({
            success: false,
            message: "Invalid token format",
        });
    }

    const totpVerificationFailure = totp.verify(req.account.username, req.account.totp.secret, req.body.token)[1];

    if (totpVerificationFailure) {
        return res.status(totpVerificationFailure.code).json({
            success: false,
            message: totpVerificationFailure.message,
        });
    }

    const backupCodes = [...Array(6)].map(() => randomString(12));

    req.account.totp = {
        secret: req.account.totp.secret,
        backupCodes,
        enabled: true,
    };

    await req.account.save();

    res.status(200).json({
        success: true,
        message: "2FA successfully enabled",
        result: {
            backupCodes,
        },
    });
});

router.post("/totp/recover", requireFields(["backupCode", "username", "password"]), async (req, res) => {
    const { username, password, backupCode } = req.body;

    const [data, error] = await login({
        username,
        password,
    });

    if (error) {
        return res.status(error.code).json({
            success: false,
            message: error.message,
        });
    }

    const { account } = data;

    if (!account.totp.enabled) {
        return res.status(412).json({
            success: false,
            message: "2FA is not enabled",
        });
    }

    if (!account.totp.backupCodes.includes(backupCode)) {
        return res.status(403).json({
            success: false,
            message: "Invalid backup code",
        });
    }

    account.totp.enabled = false;
    account.totp.backupCodes = [];
    account.totp.secret = null;
    account.save();

    res.setHeader("Set-Cookie", data.serialized);

    res.json({
        success: true,
        message: "2FA has been disabled and you have been logged in",
    });
});

router.delete("/totp", requireLogin(true), requireFields(["token"]), async (req, res) => {
    if (!req.account.totp.enabled) {
        return res.status(412).json({
            success: false,
            message: "2FA is not enabled",
        });
    }

    const totpVerificationFailure = totp.verify(req.account.username, req.account.totp.secret, req.body.token)[1];

    if (totpVerificationFailure) {
        return res.status(totpVerificationFailure.code).json({
            success: false,
            message: totpVerificationFailure.message,
        });
    }

    req.account.totp.enabled = false;
    req.account.totp.backupCodes = [];
    req.account.totp.secret = null;
    await req.account.save();

    res.json({
        success: true,
        message: "2FA has been successfully disabled",
    });
});

module.exports = router;
