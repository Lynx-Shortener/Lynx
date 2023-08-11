const getLink = require("./get");
const Account = require("../../models/account");
const { url: validUrl } = require("../valid");

module.exports = async ({
    id, slug, destination, account,
}) => {
    if (!validUrl(destination)) {
        return [
            null,
            {
                message: "Invalid destination url format",
                code: 422,
            },
        ];
    }

    if (!slug) {
        return [
            null,
            {
                message: "Invalid slug",
                code: 422,
            },
        ];
    }
    if (!destination) {
        return [
            null,
            {
                message: "Invalid destination",
                code: 422,
            },
        ];
    }
    const link = await getLink({ id });
    if (!link) {
        return [
            null,
            {
                message: "A link with that id does not exist",
                code: 404,
            },
        ];
    }

    if (link && !["owner", "admin"].includes(account.role) && account.id !== link.author) {
        return [
            null,
            {
                message: "You do not have the permissions to edit this link",
                code: 403,
            },
        ];
    }

    const matchingSlug = await getLink({ slug }, id);
    if (matchingSlug) {
        return [
            null,
            {
                message: "A link with that slug already exists",
                code: 409,
            },
        ];
    }

    if (process.env.URL_ONLY_UNIQUE === "true") {
        if (await getLink({ destination }, id)) {
            return [
                null,
                {
                    message: "A link with that destination already exists",
                    code: 409,
                },
            ];
        }
    }

    link.slug = slug;
    link.destination = destination;
    link.modifiedDate = new Date();

    await link.save();

    const linkAuthor = await Account.findOne({ id: link.author });

    link.account = linkAuthor ? linkAuthor.username : "n/a";

    return [link, null];
};
