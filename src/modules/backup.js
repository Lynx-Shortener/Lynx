const fs = require("fs");
const Link = require("../db/models/link");

module.exports = async ({ count: backupCount }) => {
    const links = await Link.find({}, "-_id -__v");
    if (!fs.existsSync("../backups")) {
        fs.mkdirSync("../backups");
    }

    let filename = "backup";

    if (backupCount !== 1) {
        filename += `-${new Date().toISOString().replace(/:/g, "-")}`;
    }

    fs.writeFileSync(`../backups/${filename}.json`, JSON.stringify(links, null, 4));

    if (backupCount !== -1) {
        const existingBackups = fs.readdirSync("../backups").map((file) => ({
            filename: file,
            time: fs.statSync(`../backups/${file}`).mtime.getTime(),
        }));

        const oldBackups = existingBackups
            .sort((a, b) => a.time - b.time)
            .map((file) => file.filename)
            .slice(0, backupCount * -1);

        oldBackups.forEach((file) => {
            fs.unlinkSync(`../backups/${file}`);
        });
    }

    console.log(`${filename}.json created. Links backed up: ${links.length.toLocaleString()}`);
};
