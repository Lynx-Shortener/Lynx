const Link = require("../../models/link");
const Account = require("../../models/account");

module.exports = async ({ ids, all, account }) => {
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
        const authorQuotaChanges = await Link.aggregate([
            {
                $match: {
                    id: { $in: ids },
                },
            },
            {
                $group: {
                    _id: "$author",
                    linkCount: { $sum: -1 },
                    links: { $push: "$id" },
                },
            },
        ]);

        const authorQuotasChanged = authorQuotaChanges.map(async (author) => {
            const updated = await Account.updateOne({ id: author._id }, { $inc: { "quota.links.used": author.linkCount } }, { new: true });
            author.success = updated.modifiedCount === 1;
            return author;
        });

        const failedAuthorQuotaUpdates = authorQuotasChanged.filter((author) => author.success === false);

        if (failedAuthorQuotaUpdates.length !== 0) {
            return [null, {
                code: 500,
                message: `Internal server error updating link quotas for ${failedAuthorQuotaUpdates.length} unique users, no actions have been performed`,
            }];
        }

        await Link.deleteMany({
            id: {
                $in: ids,
            },
        });
        return [{
            success: true,
            message: `Successfully deleted ${ids.length} links`,
            result: {
                linksDeleted: ids.length,
            },
        }, null];
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
