const Profiles = require("../models/profiles-model");
const Synonyms = require("../models/synonyms-model");

const profile_upload = async (req, res) => {
    try {
        const bulkData = req.body;

        if (!Array.isArray(bulkData)) {
            return res.status(400).json({ message: "Input should be an array of objects." });
        }

        const insertedDocs = await Profiles.insertMany(bulkData);
        return res.status(200).json({
            message: "Uploaded documents. ",
            count: insertedDocs.length
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error."
        })
    }
}

const synonym_upload = async (req, res) => {
    try {
        const docs = req.body;

        if (!Array.isArray(docs)) {
            return res.status(400).json({
                message: "Input should be an array of objects."
            })
        }

        const insertedDocs = await Synonyms.insertMany(docs);
        return res.status(200).json({
            success: true,
            message: "Uploaded documents",
            count: insertedDocs.length
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error."
        })
    }
}

module.exports = { profile_upload, synonym_upload };