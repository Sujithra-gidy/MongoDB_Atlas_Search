//middleware to sanitize the query.

const validateQuery = async (req, res, next) => {

    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: "Search query is required." });
    }

    // to check if any is any other keys rather than query, page and limit;
    const allowedKeys = ['q', 'page', 'limit'];
    for (const key of Object.keys(req.query)) {
        if (!allowedKeys.includes(key)) {
            return res.status(400).json({
                message: `Unexpected query parameter: ${key}`
            })
        }
    }

    if (query && typeof query !== "string") {
        return res.status(400).json({
            message: "Invalid query type"
        })
    }

    // allowing only alphabets and numeric characters. 
    const invalidData = /[$&<>{};'"\\]/;
    const validData = /^[a-zA-Z0-9\s\+\#\.]+$/;

    if (query && (invalidData.test(query) || !validData.test(query))) {
        console.log(query)
        return res.status(400).json({
            message: "Invalid search query"
        })
    }

    // checking page and limit 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (page && (isNaN(page) || page <= 0)) {
        return res.status(400).json({
            message: "Invalid page number"
        })
    }

    if (limit && (isNaN(limit) || limit <= 0 || limit > 100)) {
        return res.status(400).json({
            message: "Invalid limit value"
        })
    }

    next();
}

module.exports = validateQuery;