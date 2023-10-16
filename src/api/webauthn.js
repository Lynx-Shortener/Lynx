const express = require("express");

const router = express.Router();
const { generateRegistrationOptions, verifyRegistrationResponse } = require("@simplewebauthn/server");
const requireFields = require("./middleware/requireFields");
const requireLogin = require("./middleware/requireLogin");

const Account = require("../db/models/account");

// https://simplewebauthn.dev/docs/packages/browser#startregistration

const origin = process.env.DOMAIN;
const rpID = origin.match(/(?:(localhost:\d+)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+)|([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}))(?::\d+)?/)[0];
const rpName = "Lynx";

router.get("/register/start", requireLogin(true), async (req, res) => {
    try {
        const { account } = req;

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: account.id,
            userName: account.username,
            attestationType: "none",
            excludeCredentials: account.twoFactorAuthentication.webAuthn.authenticators.map((authenticator) => ({
                id: authenticator.id,
                type: "public-key",
            })),
        });

        const updatedAccount = await Account.findOneAndUpdate({ id: account.id }, { $set: { "twoFactorAuthentication.webAuthn.lastChallenge": options.challenge } }, { new: true });
        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Could not find the relevant account to start the webauthn process with.",
            });
        }

        res.status(200).json({ success: true, result: { options } });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when creating WebAuthn challenge",
        });
    }
});

router.post("/register/verify", requireLogin(true), requireFields(["attpResp", "name"]), async (req, res) => {
    try {
        let verification;

        const { attpResp: response, name: authenticatorName } = req.body;

        if (req.account.twoFactorAuthentication.webAuthn.authenticators.map((authenticator) => authenticator.name).includes(authenticatorName)) {
            return res.status(409).json({
                success: false,
                message: "An authenticator already exists with that name",
            });
        }

        try {
            verification = await verifyRegistrationResponse({
                response,
                expectedChallenge: req.account.twoFactorAuthentication.webAuthn.lastChallenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
            });
        } catch (error) {
            return res.status(400).send({
                success: false,
                message: error.message,
            });
        }

        const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;

        if (verification.verified) {
            const authenticator = {
                credentialPublicKey: Buffer.from(credentialPublicKey),
                id: Buffer.from(credentialID),
                counter,
                name: authenticatorName,
            };

            const updatedAccount = await Account.findOneAndUpdate(
                { id: req.account.id },
                { $push: { "twoFactorAuthentication.webAuthn.authenticators": authenticator }, $unset: { "twoFactorAuthentication.webAuthn.lastChallenge": "" } },
                { new: true },
            );
            if (!updatedAccount) {
                return res.status(404).json({
                    success: false,
                    message: "Could not find the relevant account to add the authenticator to.",
                });
            }

            res.status(200).json({
                success: true,
                message: "WebAuthn authenticator verified.",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "The WebAuthn authenticator was not able to be verified",
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when verifying WebAuthn authenticator",
        });
    }
});

router.get("/authenticators", requireLogin(true), async (req, res) => {
    const authenticators = req.account.twoFactorAuthentication.webAuthn.authenticators.map((authenticator) => ({
        id: authenticator.id,
        name: authenticator.name,
    }));
    return res.status(200).json({
        success: true,
        result: {
            authenticators,
        },
    });
});

router.get("/", (req, res) => {
    res.send("ok");
});

module.exports = router;
