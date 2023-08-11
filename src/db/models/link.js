const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    id: String,
    slug: String,
    destination: String,
    author: String,
    creationDate: Date,
    modifiedDate: Date,
    visits: Number,
});

const Link = mongoose.model("Link", schema);

module.exports = Link;
