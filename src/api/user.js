const express = require("express");

const router = express.Router();
const requireAccountValue = require("./middleware/requireAccountValue");
const account = require("../db/modules/account");
const requireFields = require("./middleware/requireFields");
const updateAccount = require("../db/modules/account/update");
const valid = require("../db/modules/valid");

const requireVerification = require("./middleware/requireVerification");

// const requireFields = require("./middleware/requireFields");
// const requireTOTP = require("./middleware/requireTOTP");

router.get("/list", async (req, res) => {
    try {
        let accounts = await account.get.all();
        const roles = ["owner", "admin", "standard"];
        accounts = accounts.filter((returnedAccount) => req.account.role === "owner"
            || returnedAccount.id === req.account.id
            || (returnedAccount.role !== "admin" && returnedAccount.role !== "owner")).sort((a, b) => {
            if (a.id === req.account.id) {
                return -1; // move own account to top
            }
            if (b.id === req.account.id) {
                return 1; // move own account to top
            }
            const roleComparison = roles.indexOf(a.role) - roles.indexOf(b.role);

            if (roleComparison !== 0) {
                return roleComparison; // If roles are different, sort by role
            }

            return a.id.localeCompare(b.id);
        });
        res.status(200).json({
            success: true,
            result: accounts,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when listing users",
        });
    }
});

// delete a user

router.delete("/", requireVerification, async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Updating of credentials is not enabled in demo mode.",
        });
    }
    try {
        if (!req.body.user) {
            return res.status(400).json({
                success: false,
                message: "A user object is required",
            });
        }
        const {
            id,
        } = req.body.user;

        const [Account, AccountError] = await account.get.byID({ id });
        if (AccountError) {
            return res.status(AccountError.code).json({
                success: false,
                message: AccountError.message,
            });
        }

        if (Account.role === "owner" || (Account.role === "admin" && req.account.role === "admin")) {
            return res.status(401).json({
                success: false,
                message: "You do not have permission to delete that user",
            });
        }

        const [deletionSuccess, deletionError] = await account.delete({ id });

        if (deletionError) {
            return res.status(deletionError.code).json({
                success: false,
                message: deletionError.message,
            });
        }

        res.status(200).json({
            success: true,
            message: deletionSuccess,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when deleting user",
        });
    }
});

// Create a user
router.post("/", requireVerification, async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Creation of users is not enabled in demo mode.",
        });
    }
    try {
        if (!req.body.user) {
            return res.status(400).json({
                success: false,
                message: "A user object is required",
            });
        }
        const {
            username, email, password, role,
        } = req.body.user;

        let allowedRoles = ["admin", "standard"];

        if (req.account.role === "admin") allowedRoles = ["standard"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: `Invalid role or permissions, accepted roles: ${allowedRoles.join(", ")}`,
            });
        }

        const [data, error] = await account.register({
            email,
            username,
            password,
            role,
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
            message: "Internal Server Error when creating user",
        });
    }
});

router.patch("/username", requireFields(["user"]), requireVerification, async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Updating of user roles is not enabled in demo mode.",
        });
    }
    try {
        const { username, account: accountID } = req.body.user;
        const validUsername = valid.username(username);
        if (!validUsername) {
            return res.status(400).json({
                success: false,
                message: "Invalid username format",
            });
        }

        const user = await account.get.byID(accountID);

        const canUpdate = req.account.id === user.id
            || (req.account.role === "owner" && user.role !== "owner")
            || (req.account.role === "admin" && user.role === "standard");

        if (!canUpdate) {
            return res.status(403).json({
                success: false,
                message: "You do not have the required role to update that user.",
            });
        }

        const [usernameUpdate, usernameUpdateError] = await updateAccount.username({ account: accountID, username });

        if (usernameUpdateError) return res.status(usernameUpdateError.code).json({ success: false, message: usernameUpdateError.message });

        return res.status(200).json({
            success: true,
            result: usernameUpdate,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when updating user",
        });
    }
});

router.post("/role", requireAccountValue({ role: ["owner"] }), requireVerification, async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Updating of user roles is not enabled in demo mode.",
        });
    }
    try {
        if (!req.body.user) {
            return res.status(400).json({
                success: false,
                message: "A user object is required",
            });
        }

        const { role, userID } = req.body.user;

        if (!["admin", "owner", "standard"].includes(role)) {
            return res.status(417).json({
                success: false,
                message: "Invalid role",
            });
        }

        const [user, userError] = await account.get.byID({ id: userID });

        if (!user) {
            return res.status(userError.code).json({
                success: false,
                message: userError.message,
            });
        }

        const [updatedUser, updatedUserError] = await account.update.role({ account: user, role });

        if (!updatedUser) {
            return res.status(updatedUserError.code).json({
                success: false,
                message: updatedUserError.message,
            });
        }

        if (role === "owner") {
            const [updatedSelf, updatedSelfError] = await account.update.role({ account: req.account, role: "admin" });

            if (!updatedSelf) {
                return res.status(updatedSelfError.code).json({
                    success: false,
                    message: updatedSelfError.message,
                });
            }
        }

        res.status(200).json({
            success: true,
            result: {
                user: updatedUser,
            },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error when updating user",
        });
    }
});

module.exports = router;
