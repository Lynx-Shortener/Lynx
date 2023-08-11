module.exports = (username) => /^(?=.{3,20}$)(?![_.])[a-zA-Z0-9._]+(?<![_.])$/.test(username);
