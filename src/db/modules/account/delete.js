const Account = require("../../models/account");

module.exports = async ({ id }) => {
    try {
        await Account.findOneAndDelete({ id });

        return ["Deleted account!", null];
    } catch (e) {
        console.log(e);
        return [null, true];
    }
};
