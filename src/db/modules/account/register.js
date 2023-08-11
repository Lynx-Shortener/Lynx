const Account = require("../../models/account");
const valid = require("../valid");
const createAccount = require("./create");

module.exports = async ({
    email, username, password, role,
}) => {
    const invalid = {
        email: false,
        username: false,
        password: false,
    };

    invalid.email = !valid.email(email);
    invalid.username = !valid.username(username);
    invalid.password = !valid.password(password);

    if (invalid.password || invalid.username || invalid.email) {
        return [
            null,
            {
                code: 400,
                message: "Invalid field(s)",
                details: { invalid },
            },
        ];
    }

    const exists = {
        username: false,
        email: false,
    };

    // check if username or email are used
    // replace function escapes any regex
    const usernameRegex = new RegExp(username.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
    exists.username = (await Account.findOne({ username: usernameRegex })) !== null;

    const emailRegex = new RegExp(email.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
    exists.email = (await Account.findOne({ email: emailRegex })) !== null;

    if (exists.email || exists.username) {
        return [
            null,
            {
                code: 400,
                message: "Field(s) are already used",
                details: { exists },
            },
        ];
    }

    const [account, error] = await createAccount({
        username,
        email,
        password,
        role,
    });

    if (account) return ["Account created", null];
    if (!error) {
        return [
            null,
            {
                code: 500,
                message: "Internal Server Error when registering account",
            },
        ];
    }
};
