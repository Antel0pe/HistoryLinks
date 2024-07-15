const mongoose = require("mongoose");
 
const WikipediaReferenceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        linked_article_title: {
            type: String,
            required: true,
        },
    },
);
 
const WikipediaReference = mongoose.model("Wikipediareference", WikipediaReferenceSchema);
module.exports = WikipediaReference;