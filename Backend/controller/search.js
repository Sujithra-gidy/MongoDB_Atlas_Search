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
                            { phrase: { query: query, path: "skills", slop: 1, score: { boost: { value: 10 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query: query, path: "job", score: { boost: { value: 9.5 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query: query, path: "location", score: { boost: { value: 9 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query: query, path: "education.course", score: { boost: { value: 8 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query: query, path: "experience.role", score: { boost: { value: 8 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query: query, path: "user_certificates.certificate_name", score: { boost: { value: 7 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query: query, path: "education.degree", score: { boost: { value: 7 } }, synonyms: "profileSynonyms" } },


                            // --- MEDIUM PRIORITY: General Text Matches (Individual words with fuzzy) ---
                            { text: { query: query, path: ["skills", "job", "location"], fuzzy: { maxEdits: 1 }, score: { boost: { value: 6 } } } },
                            { text: { query: query, path: ["experience.role", "education.course", "education.degree"], fuzzy: { maxEdits: 1 }, score: { boost: { value: 3 } } } },
                            { text: { query: query, path: "user_certificates.certificate_name", fuzzy: { maxEdits: 1 }, score: { boost: { value: 2 } } } },

                            // --- LOW PRIORITY: Autocomplete Matches (for prefix and fuzzy) ---
                            { autocomplete: { query: query, path: "college_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "company_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "email_id", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "first_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "last_name", fuzzy: { maxEdits: 1 } } },
                            // { autocomplete: { query: query, path: "location", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query: query, path: "user_certificates.certification_provider", fuzzy: { maxEdits: 1 } } }
                        ],
                        minimumShouldMatch: 1
                    },
                    highlight: {
                        path: ["skills", "job", "experience.role", "first_name", "last_name"]
                    }
                }
            },
            {
                $addFields: {
                    score: { $meta: "searchScore" },
                    highlights: { $meta: "searchHighlights" }
                }
            },
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