const express = require("express");

const router = express.Router();
const requireAccountValue = require("./middleware/requireAccountValue");
const account = require("../db/modules/account");

const requireVerification = require("./middleware/requireVerification");

// const requireFields = require("./middleware/requireFields");
// const requireTOTP = require("./middleware/requireTOTP");

router.get("/list", async (req, res) => {
    try {
        let accounts = await account.get.all();
        const roles = ["owner", "admin", "standard"];
        accounts = accounts.filter((returnedAccount) => !(req.account.role !== "owner" && returnedAccount.role === "owner")).sort((a, b) => {
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

router.post("/role", requireAccountValue({ role: ["owner"] }), requireVerification, async (req, res) => {
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
            message: "Internal Server Error when listing users",
        });
    }
});

module.exports = router;
