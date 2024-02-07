const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { current: currentAccount, bySecret: getAccountBySecret, byID: getAccountByID } = require("../../db/modules/account/get");

module.exports = (disallowSecret, softFail) => async (req, res, next) => {
    let account;
    let error;

    if (req.body.secret || (req.headers.authorization && !req.headers.authorization.startsWith("Bearer"))) {
        if (disallowSecret) {
            return res.status(403).json({
                success: false,
                message: "You cannot use this endpoint with your API secret",
            });
        }

        [account, error] = await getAccountBySecret({
            secret: req.body.secret || req.headers.authorization,
        });
    } else {
        [account, error] = await currentAccount(req);
    }

    if (error && error.message === "No cookie token provided" && process.env.SOLE_USER) {
        const [soleAccount, soleAccoutError] = await getAccountByID({ id: process.env.SOLE_USER });
        if (soleAccoutError) {
            console.log(soleAccoutError);
        } else if (soleAccount.allowAutomaticLogin) {
            const expiresIn = process.env.DEMO === "true" ? "1h" : "7d";

            const token = jwt.sign(
                {
                    id: soleAccount.id,
                },
                process.env.JWT_KEY,
                {
                    algorithm: "HS256",
                    expiresIn,
                },
            );

            const serialized = cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.USE_HTTPS === "true",
                sameSite: "strict",
                maxAge: process.env.DEMO ? 3600 * 1000 : 86400 * 1000 * 7,
                path: "/",
            });

            res.setHeader("Set-Cookie", serialized);
            account = soleAccount;
            error = false;
        }
    }

    if (error && !softFail) {
        return res.status(error.code).json({
            success: false,
            message: error.message,
        });
    }

    if (!error) req.account = account;

    next();
};
