module.exports = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.* ).{12,}$/.test(password);
