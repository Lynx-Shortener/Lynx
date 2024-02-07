const Link = require("../../models/link");
const Account = require("../../models/account");

module.exports = async ({
    pagesize, page, sortType, sortField, account, search, userID,
}) => {
    const total = await Link.count();
    const query = {};
    const andQuery = [];

    if (account.role === "admin") {
        andQuery.push({
            $or: [
                { author: account.id },
                { author: { $in: await Account.find({ role: "standard" }).distinct("id") } },
            ],
        });
    } else if (account.role === "standard") {
        andQuery.push({
            $or: [
                { author: account.id },
            ],
        });
    }

    if (search) {
        // search destination and slug
        const filter = [];
        filter.push({ slug: new RegExp(search, "i") });
        filter.push({ destination: new RegExp(search, "i") });
        andQuery.push({
            $or: filter,
        });
    }

    if (userID !== "") {
        andQuery.push({
            author: userID,
        });
    }

    if (andQuery.length > 0) {
        query.$and = andQuery;
    }

    const sort = {};

    sort[sortField] = Number(sortType);

    sort.id = -1;

    let links = await Link.find(query, null, {
        skip: page * pagesize,
        limit: pagesize,
        sort,
    });

    links = await Promise.all(
        links.map(async (link) => {
            const author = await Account.findOne({ id: link.author });
            link.account = author ? author.username : "n/a";
            return link;
        }),
    );

    let remaining = Math.ceil((total - page * pagesize) / pagesize) - 1;

    if (remaining < 0) remaining = 0;

    return {
        remaining,
        links,
    };
};
