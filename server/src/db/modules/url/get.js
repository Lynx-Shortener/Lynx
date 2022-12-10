const URL = require("../../models/url")

module.exports = async ({slug, destination, id}) => {
    if (slug) return await URL.findOne({slug})
    if (destination) return await URL.findOne({destination})
    if (id) return await URL.findOne({id})
}