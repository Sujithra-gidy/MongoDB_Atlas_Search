const Profiles = require("../models/profiles-model");

const search_profiles = async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        if (!query) {
            return res.status(400).json({
                message: "Search query is required."
            });
        }

        const skip = (page - 1) * limit;

        const result = await Profiles.aggregate([
            {
                $search: {
                    index: "default",
                    compound: {
                        should: [
                            // --- HIGH PRIORITY: Exact Phrase Matches in Core Fields ---
                            { phrase: { query: query, path: "education.course", score: { boost: { value: 10 } } } },
                            { phrase: { query: query, path: "job", score: { boost: { value: 8 } } } },
                            { phrase: { query: query, path: "experience.role", score: { boost: { value: 8 } } } },
                            { phrase: { query: query, path: "user_certificates.certificate_name", score: { boost: { value: 7 } } } },
                            { phrase: { query: query, path: "education.degree", score: { boost: { value: 7 } } } },
                            { phrase: { query: query, path: "skills", slop: 1, score: { boost: { value: 8 } } } },
                            { phrase: { query: query, path: "bio", slop: 3, score: { boost: { value: 4 } } } },

                            // --- MEDIUM PRIORITY: General Text Matches (Individual words with fuzzy) ---
                            { text: { query: query, path: "education.course", fuzzy: { maxEdits: 1 }, score: { boost: { value: 5 } } } },
                            { text: { query: query, path: "job", fuzzy: { maxEdits: 1 }, score: { boost: { value: 3 } } } },
                            { text: { query: query, path: "skills", fuzzy: { maxEdits: 1 }, score: { boost: { value: 3 } } } },
                            { text: { query: query, path: "bio", fuzzy: { maxEdits: 1 }, score: { boost: { value: 1 } } } },
                            { text: { query: query, path: "user_certificates.certificate_name", fuzzy: { maxEdits: 1 }, score: { boost: { value: 2 } } } },
                            { text: { query: query, path: "experience.role", fuzzy: { maxEdits: 1 }, score: { boost: { value: 3 } } } },
                            { text: { query: query, path: "education.degree", fuzzy: { maxEdits: 1 }, score: { boost: { value: 4 } } } },

                            // --- LOW PRIORITY: Autocomplete Matches (for prefix and fuzzy) ---
                            { autocomplete: { query: query, path: "job", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "skills", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "college_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "company_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "education.college_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "education.course", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "education.degree", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "email_id", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "experience.company_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "experience.role", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "first_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "last_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "location", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "user_certificates.certification_provider", fuzzy: { maxEdits: 1 } } }
                        ],
                        minimumShouldMatch: 1
                    }
                }
            },
            { $addFields: { score: { $meta: "searchScore" } } },
            { $sort: { score: -1, created_time: -1 } }, //also sort by profile completion. 
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    first_name: 1,
                    last_name: 1,
                    email_id: 1,
                    job: 1,
                    skills: 1,
                    created_time: 1,
                    updated_time: 1,
                    user_certificates: 1,
                    location: 1,
                    bio: 1,
                    education: 1,
                    experience: 1,
                    score: 1
                }
            }
        ]);


        res.status(200).json({
            message: "Search successful",
            currentPage: page,
            pageSize: limit,
            data: result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = { search_profiles }