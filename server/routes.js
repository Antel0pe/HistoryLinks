const express = require("express");
const WikipediaReference = require("./models/WikipediaReference");
const _ = require("underscore");

const router = express.Router();


router.get("/test", async (req, res) => {
    console.log('received test request');

    let randomList = ['ancient greece', 'persia', 'roman empire', 'nubia', 'mesopotamia', 'zhou dynasty', 'hittites', 'ancient egypt', 'aztecs', 'vedic civilizations', 'carthage', 'indus valley'];
    
    let random_sample = _.sample(randomList, 3);
    

    res.send(random_sample); 
});

// Get all articles referenced in requested page
router.get("/outlinks/:articleTitle", async (req, res) => {
    let articleTitle = req.params.articleTitle.toLowerCase();

    console.log('Looking up pages referenced by ' + articleTitle);

    let outlinks = await WikipediaReference
        .findOne({ title: articleTitle }, 'linked_article_titles');
        
    outlinks = outlinks === null ? [] : outlinks.linked_article_titles;

    outlinks = tempPadOutValues(outlinks);
    
    res.send(outlinks);
});

// Get all articles that reference requested page
router.get("/inlinks/:articleTitle", async (req, res) => {
    let articleTitle = req.params.articleTitle.toLowerCase();

    console.log('Looking up pages referencing ' + articleTitle);

    let inlinks = await WikipediaReference
        .find({ linked_article_titles: articleTitle }, 'title');
    
    inlinks = inlinks.map(a => a.title);
         
    inlinks = tempPadOutValues(inlinks);
    
    res.send(inlinks);
});


// Always return array with 3 values - pad spaces
function tempPadOutValues(arr) {
    if (arr.length === 0) {
        return Array(3).fill('placeholder value');
    } else {
        return arr;
    }
}


module.exports = router;