module.exports = (requirements) => async (req, res, next) => {
    const { account } = req;

    const humanFields = [];

    const invalidFields = Object.keys(requirements).filter((requirement) => {
        if (Array.isArray(requirements[requirement])) {
            const matchedRequirements = requirements[requirement].filter((value) => value === account[requirement]);

            if (matchedRequirements.length === 0) {
                humanFields.push(`${requirement}: ${requirements[requirement].join(" or ")}`);
                return true;
            }
        } else if (account[requirement] !== requirements[requirement]) {
            humanFields.push(`${requirement}: ${requirements[requirement]}`);

            return true;
        }
        return false;
    });

    if (invalidFields.length >= 1) {
        return res.status(412).json({
            success: false,
            message: `Currently logged-in account does not match ${humanFields.join(",")}`,
        });
    }

    next();
};
