const express = require("express");

const router = express.Router();
const requireFields = require("./middleware/requireFields");
const requireLogin = require("./middleware/requireLogin");
const requireTwoFactor = require("./middleware/requireTwoFactor");
const validateTwoFactor = require("../db/modules/validateTwoFactor");
const countAccounts = require("../db/modules/account/count");
const createSecret = require("../db/modules/secret/create");
const totp = require("../db/modules/totp");
const returnAccount = require("../modules/returnAccount");
const getAccountById = require("../db/modules/account/get/byID");

const {
    login,
    update: {
        email: updateEmail, password: updatePassword, username: updateUsername, automaticLogin,
    },
    register,
} = require("../db/modules/account");
const requireVerification = require("./middleware/requireVerification");

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
        const { username, password, token } = req.body;

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

        const twoFactorError = validateTwoFactor(data.account, token)[1];
        if (twoFactorError) {
            return res.status(twoFactorError.code).json({
                success: false,
                message: twoFactorError.message,
            });
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

router.patch("/email", requireLogin(true), requireFields(["newEmail", "password"]), requireTwoFactor, async (req, res) => {
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

router.patch("/password", requireLogin(true), requireFields(["password", "newPassword"]), requireTwoFactor, async (req, res) => {
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

router.patch("/username", requireLogin(true), requireFields(["newUsername", "password"]), requireTwoFactor, async (req, res) => {
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

    if (req.account.twoFactorAuthentication.totp.verified) {
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

    req.account.twoFactorAuthentication = {
        enabled: false,
        totp: {
            secret: totpResult.secret,
            verified: false,
        },
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

    if (!req.account.twoFactorAuthentication.totp.secret) {
        return res.status(412).json({
            success: false,
            message: "2FA process hasn't been started",
        });
    }

    if (req.account.twoFactorAuthentication.totp.verified === true) {
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

    const totpVerificationFailure = totp.verify(req.account.username, req.account.twoFactorAuthentication.totp.secret, req.body.token)[1];

    if (totpVerificationFailure) {
        return res.status(totpVerificationFailure.code).json({
            success: false,
            message: totpVerificationFailure.message,
        });
    }

    const backupCodes = [...Array(6)].map(() => randomString(12));

    req.account.twoFactorAuthentication = {
        enabled: true,
        backupCodes,
        totp: {
            secret: req.account.twoFactorAuthentication.totp.secret,
            verified: true,
        },
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

    if (!account.twoFactorAuthentication.totp.verified) {
        return res.status(412).json({
            success: false,
            message: "2FA is not enabled",
        });
    }

    if (!account.twoFactorAuthentication.backupCodes.includes(backupCode)) {
        return res.status(403).json({
            success: false,
            message: "Invalid backup code",
        });
    }

    account.twoFactorAuthentication = {
        enabled: false,
        backupCodes: [],
        totp: {
            secret: "",
            verified: false,
        },
    };
    account.save();

    res.setHeader("Set-Cookie", data.serialized);

    res.json({
        success: true,
        message: "2FA has been disabled and you have been logged in",
    });
});

router.delete("/totp", requireLogin(true), requireFields(["token"]), async (req, res) => {
    if (!req.account.twoFactorAuthentication.totp.verified) {
        return res.status(412).json({
            success: false,
            message: "2FA is not enabled",
        });
    }

    const totpVerificationFailure = totp.verify(req.account.username, req.account.twoFactorAuthentication.totp.secret, req.body.token)[1];

    if (totpVerificationFailure) {
        return res.status(totpVerificationFailure.code).json({
            success: false,
            message: totpVerificationFailure.message,
        });
    }

    req.account.twoFactorAuthentication = {
        enabled: false,
        backupCodes: [],
        totp: {
            secret: "",
            verified: false,
        },
    };
    await req.account.save();

    res.json({
        success: true,
        message: "2FA has been successfully disabled",
    });
});

router.post("/automatic-login", requireLogin(true), requireVerification, async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Updating of credentials is not enabled in demo mode.",
        });
    }

    const [account, error] = await automaticLogin({
        account: req.account.id,
        value: true,
    });

    if (error) {
        return res.status(error.code).json({
            success: false,
            message: error.message,
        });
    }

    return res.status(200).json({
        success: true,
        message: account.message,
        details: {
            account: account.account,
        },
    });
});

router.delete("/automatic-login", requireLogin(true), requireVerification, async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Updating of credentials is not enabled in demo mode.",
        });
    }

    const [account, error] = await automaticLogin({
        account: req.account.id,
        value: false,
    });

    if (error) {
        return res.status(error.code).json({
            success: false,
            message: error.message,
        });
    }

    return res.status(200).json({
        success: true,
        message: account.message,
        details: {
            account: account.account,
        },
    });
});

module.exports = router;
