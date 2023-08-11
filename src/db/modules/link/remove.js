const Link = require("../../models/link");

module.exports = async ({ ids, account }) => {
    const links = await Link.find({
        id: {
            $in: ids,
        },
    });
    if (!["owner", "admin"].includes(account.role)) {
        const ownedLinks = links.filter((link) => link.author === account.id);
        if (ownedLinks.length !== links.length) {
            return [
                null,
                {
                    code: 403,
                    message: "You do not have the permissions to delete some of or all of the selected links. No links were deleted",
                },
            ];
        }
    }
    try {
        await Link.deleteMany({
            id: {
                $in: ids,
            },
        });
        return [true, null];
    } catch (e) {
        console.log(e);
        return [
            null,
            {
                code: 500,
                message: "Internal Server Error when deleting Link",
            },
        ];
    }
};
