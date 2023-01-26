module.exports = (account, file) => {
	const sizeInMB = file.size / 1000000;

	return [true, null];
};
