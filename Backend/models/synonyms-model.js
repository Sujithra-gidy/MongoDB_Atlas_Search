const mongoose = require("mongoose");

const synonym = new mongoose.Schema({
    mappingType: {
        type: String,
        enum: ["equivalent", "explicit"],
        reuire: true
    },
    input: {
        type: [String],
        required: function () {
            return this.mappingType === "explicit";
        }
    },
    synonyms: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model("Synonyms", synonym);