const { v4: uuid4 } = require("uuid");
const Link = require("../../models/link");
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

    return [link, null];
};
