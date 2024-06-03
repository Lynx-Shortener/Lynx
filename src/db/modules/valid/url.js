module.exports = (url) => {
    const regex = new RegExp(
        process.env.URL_REGEX || "https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,63}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)",
    );
    return regex.test(url);
};
