const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");

const router = express.Router();
const { parse } = require("csv-parse");
const { v4: uuid4 } = require("uuid");
const Link = require("../db/models/link");
const requireLogin = require("./middleware/requireLogin");
const requireFields = require("./middleware/requireFields");
const Account = require("../db/models/account");

const upload = multer({ dest: "tmp/uploads/" });

const fields = {
    shlink: ["shortUrl", "longUrl", "createdAt", "visits"],
    lynx: ["id", "slug", "destination", "author", "creationDate", "modifiedDate", "visits"],
    yourls: ["source", "target", "hits"],
};

const processFile = async (filePath) => {
    const results = [];
    return new Promise((resolve) => {
        fs.createReadStream(filePath)
            .pipe(parse({ columns: true, trim: true }))
            .on("data", (data) => results.push(data))
            .on("end", () => {
                resolve([results, null]);
            })
            .on("error", (e) => {
                resolve([null, e]);
            });
    });
};

router.post("/", requireLogin(), upload.single("file"), requireFields(["service"]), async (req, res) => {
    if (process.env.DEMO === "true") {
        return res.status(406).json({
            success: false,
            message: "Imports are not enabled in demo mode.",
        });
    }
    try {
        const { service } = req.body;

        const filetype = req.file.originalname.split(".").at(-1);
        const allowedFiletypes = ["json", "csv"];
        if (!allowedFiletypes.includes(filetype)) {
            return res.status(400).json({
                message: "Invalid filetype",
            });
        }
        let links;
        const filepath = path.join("tmp", "uploads", req.file.filename);
        const accounts = await Account.find({});
        if (filetype === "csv") {
            const [rows, parseError] = await processFile(filepath);
            if (parseError) {
                console.log(`Error importing from ${service}: ${parseError}`);
                return res.status(500).json({
                    success: false,
                    message: "Internal server parsing csv",
                });
            }

            // fs.unlinkSync(filepath);
            if (fields[service].filter((requirement) => !Object.keys(rows[0]).includes(requirement)).length !== 0) {
                return res.status(400).json({
                    message: "Invalid import fields",
                });
            }

            links = rows.map((row) => {
                let link = {};
                if (service === "shlink") {
                    link.id = uuid4();
                    const slug = new URL(row.shortUrl).pathname.split("");
                    if (slug.at(0) === "/") slug.shift();
                    if (slug.at(-1) === "/") slug.pop();
                    link.slug = slug.join("");
                    link.destination = row.longUrl;
                    link.author = req.account.id;
                    link.creationDate = new Date(row.createdAt);
                    link.modifiedDate = new Date(row.createdAt);
                    link.visits = row.visits;
                } else if (service === "yourls") {
                    let slug = row.source.split("");
                    if (slug.at(0) === "/") slug.shift();
                    if (slug.at(-1) === "/") slug.pop();
                    slug = slug.join("");

                    link.id = uuid4();
                    link.slug = slug;
                    link.destination = row.target;
                    link.author = req.account.id;
                    link.creationDate = new Date();
                    link.modifiedDate = new Date();
                    link.visits = row.hits;
                } else if (service === "lynx") {
                    link = row;
                }

                return link;
            });
        } else if (filetype === "json") {
            if (service === "lynx") {
                links = JSON.parse(fs.readFileSync(filepath, "utf-8"));

                links = await Promise.all(
                    links.map(async (link) => {
                        const authorAccount = accounts.find((account) => account.id === link.author);
                        if (!authorAccount) {
                            // Claim urls from non-existing accounts
                            link.author = req.account.id;
                        }
                        return link;
                    }),
                );
                fs.unlinkSync(filepath);
            }
        }

        if (links.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No valid links were provided, please make sure your file is correct.",
            });
        }

        const slugs = links.map((link) => link.slug);

        const existingSlugs = (
            await Link.find({
                slug: {
                    $in: slugs,
                },
            })
        ).map((link) => link.slug);

        const originalLinkCount = links.length;

        if (req.account.role === "admin") {
            links = links.filter((link) => {
                const authorAccount = accounts.find((account) => account.id === link.author);

                // remove links made by other admins or the owner
                return authorAccount.id === req.account.id || authorAccount.role === "standard";
            });
        }

        const authors = Object.fromEntries(await Promise.all(
            [...new Set(await links.map((link) => link.author))].map(async (author) => [author, (await Account.findOne({ id: author }))]),
        ));

        if (links.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You do not have the permission to import any of your links, no actions have been performed.",
            });
        }

        links = links.filter((link) => !existingSlugs.includes(link.slug));

        if (links.length === 0) {
            return res.status(200).json({
                success: true,
                message: "All of your links already exist in Lynx (possibly under other users), no actions have been performed.",
            });
        }

        if (req.account.role === "standard") {
            // remove links under other users
            links = links.filter((link) => link.author === req.account.id);

            if (req.account.quota.links.limit !== -1) {
                const remainingLinkQuota = req.account.quota.links.limit - req.account.quota.links.used;
                if (links.length > remainingLinkQuota) {
                    return res.status(422).json({
                        success: false,
                        message: `That import (${links.length} links) is too large for your current link quota (${remainingLinkQuota} links remaining), either removed unneeded links from the import file or request a quota increase.`,
                    });
                }

                await Account.findOneAndUpdate({ id: req.account.id }, {
                    $inc: {
                        "quota.links.used": links.length,
                    },
                });
            }
        } else {
            const authorLinkCounts = links.reduce((counts, item) => {
                const authorID = item.author;

                counts[authorID] = (Object.prototype.hasOwnProperty.call(counts, authorID) ? { links: counts[authorID].links + 1, data: counts[authorID].data } : { links: 1, data: null });

                if (!counts[authorID].data) {
                    counts[authorID].data = authors[authorID];
                }
                return counts;
            }, {});

            const quotaUpdates = Object.entries(authorLinkCounts).map(([accountID, accountDetails]) => ({
                updateOne: {
                    filter: { id: accountID },
                    update: {
                        $inc: {
                            "quota.links.used": accountDetails.links,
                        },
                    },
                },
            }));

            await Account.bulkWrite(quotaUpdates);
        }

        // await Link.insertMany(links);
        return res.status(200).json({
            success: false,
            message: `Imported ${links.length} / ${originalLinkCount} links!`,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal Server Error when importing links",
        });
    }
});

module.exports = router;
