const Link = require("../../models/link");

module.exports = async ({ slug, destination, id }, ignoredID, countVisit) => {
    const findLink = async (obj) => {
        if (!ignoredID && !id) delete obj.id;
        return Link.findOne(obj);
    };
    let link;
    if (slug) link = await findLink({ slug, id: { $ne: ignoredID } });
    if (destination) link = await findLink({ destination, id: { $ne: ignoredID } });
    if (id) link = await findLink({ id });

    if (countVisit && link) {
        if (link.visits) link.visits += 1;
        else link.visits = 1;
        await link.save();
        return link;
    }
    return link;
};
