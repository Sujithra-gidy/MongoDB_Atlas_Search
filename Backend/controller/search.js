    const Profiles = require("../models/profiles-model");

   const search_profiles = async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        if (!query) {
            return res.status(400).json({ message: "Search query is required." });
        }

        const skip = (page - 1) * limit;

        const aggregatePipeline = [
            {
                $search: {
                    index: "default",
                    compound: {
                        should: [
                            { phrase: { query, path: "skills", slop: 1, score: { boost: { value: 10 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query, path: "job", score: { boost: { value: 9.5 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query, path: "location", score: { boost: { value: 9 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query, path: "education.course", score: { boost: { value: 8 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query, path: "experience.role", score: { boost: { value: 8 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query, path: "user_certificates.certificate_name", score: { boost: { value: 7 } }, synonyms: "profileSynonyms" } },
                            { phrase: { query, path: "education.degree", score: { boost: { value: 7 } }, synonyms: "profileSynonyms" } },

                            { text: { query, path: ["skills", "job", "location"], fuzzy: { maxEdits: 1 }, score: { boost: { value: 6 } } } },
                            { text: { query, path: ["experience.role", "education.course", "education.degree"], fuzzy: { maxEdits: 1 }, score: { boost: { value: 3 } } } },
                            { text: { query, path: "user_certificates.certificate_name", fuzzy: { maxEdits: 1 }, score: { boost: { value: 2 } } } },

                            { autocomplete: { query, path: "college_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query, path: "company_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query, path: "email_id", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query, path: "first_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query, path: "last_name", fuzzy: { maxEdits: 1 } } },
                            { autocomplete: { query, path: "user_certificates.certification_provider", fuzzy: { maxEdits: 1 } } }
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
            { $sort: { score: -1, created_time: -1 } },

            {
                $facet: {
                    data: [
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
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ];

        const result = await Profiles.aggregate(aggregatePipeline);

        const data = result[0].data;
        const totalCount = result[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            message: "Search successful",
            currentPage: page,
            pageSize: limit,
            totalResults: totalCount,
            totalPages,
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


    const get_all_profiles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [profiles, totalCount] = await Promise.all([
            Profiles.find().skip(skip).limit(limit),
            Profiles.countDocuments()
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            message: "All the existing users.",
            currentPage: page,
            pageSize: limit,
            totalResults: totalCount,
            totalPages,
            data: profiles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error."
        });
    }
};



    module.exports = { search_profiles, get_all_profiles }