const { v4: uuid4 } = require("uuid");
const Link = require("../../models/link");
const Account = require("../../models/account");
const getLink = require("./get");
const { url: validUrl } = require("../valid");

const chars = {
    alpha: "abcdefghijklmnopqrstuvwxyz",
    numeric: "0123456789",
};

const generateSlug = async () => {
    let charset;
    let slug;

    switch (process.env.URL_SET) {
    case "standard":
        charset = chars.alpha.toLowerCase() + chars.alpha.toUpperCase() + chars.numeric;
        break;

    case "lower":
        charset = chars.alpha.toLowerCase();
        break;

    default:
        break;
    }

    const generateUniqueSlug = async () => {
        slug = [...new Array(Number(process.env.URL_LENGTH))].map(() => charset[Math.floor(Math.random() * charset.length)]).join("");

        const existingSlug = await Link.findOne({ slug });
        if (existingSlug) {
            return generateUniqueSlug();
        }

        return slug;
    };

    return generateUniqueSlug();
};

module.exports = async ({ author, slug: providedSlug, destination }) => {
    let slug = providedSlug;

    if (author.quota.links.limit !== -1 && author.quota.links.used === author.quota.links.limit) {
        return [
            null,
            {
                message: `Link creation failed, ${author.quota.links.used}/${author.quota.links.limit} links used, please delete some of your existing links or request a quota increase.`,
                code: 403,
            },
        ];
    }

    if (!validUrl(destination)) {
        return [
            null,
            {
                message: "Invalid destination url format",
                code: 422,
            },
        ];
    }

    if (providedSlug) {
        const existingLink = await getLink({ slug: providedSlug });
        if (existingLink) {
            return [
                null,
                {
                    message: "A link with that slug already exists",
                    code: 409,
                },
            ];
        }

        slug = providedSlug;
    } else {
        slug = await generateSlug();
    }

    if (process.env.URL_ONLY_UNIQUE === "true") {
        const existingLink = await getLink({ destination });
        if (existingLink) {
            return [
                null,
                {
                    message: "A link with that destination already exists",
                    code: 409,
                },
            ];
        }
    }

    const link = new Link({
        id: uuid4(),
        slug,
        destination,
        author: author.id,
        creationDate: new Date(),
        modifiedDate: new Date(),
        visits: 0,
    });

    await link.save();

    link.account = author.username;

    const updatedUser = await Account.findOneAndUpdate({ id: author.id }, { $inc: { "quota.links.used": 1 } }, { new: true });
    if (!updatedUser) {
        await Link.findOneAndDelete({ id: link.id });
        return [null, {
            code: 500,
            message: "Link was internally created successfully but there was an error updating the author's quota. The link has been removed.",
        }];
    }

    return [link, null];
};
