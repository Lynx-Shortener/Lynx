const fs = require("fs");
const path = require("path");

module.exports = (fields, fieldLocation) => (req, res, next) => {
    const unmetFields = fields.filter((field) => !Object.keys(req[fieldLocation || "body"]).includes(field));
    if (unmetFields.length !== 0) {
        if (req.file) {
            fs.unlinkSync(path.join("tmp", "uploads", req.file.filename));
        }
        return res.status(400).json({
            success: false,
            message: `The following required fields were not included in the request: ${unmetFields.join(", ")}`,
        });
    }
    next();
};
