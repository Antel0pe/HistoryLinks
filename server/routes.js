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
        .find({ title: articleTitle }, 'linked_article_title');
        
    outlinks = outlinks.map(a => a.linked_article_title);
    
    console.log('found ' + outlinks);

    outlinks = tempPadOutValues(outlinks);
    
    res.send(outlinks);
});

// Get all articles that reference requested page
router.get("/inlinks/:articleTitle", async (req, res) => {
    let articleTitle = req.params.articleTitle.toLowerCase();

    console.log('Looking up pages referencing ' + articleTitle);

    let inlinks = await WikipediaReference
        .find({ linked_article_title: articleTitle }, 'title');
    
    inlinks = inlinks.map(a => a.title);
         
    console.log('found ' + inlinks);

    inlinks = tempPadOutValues(inlinks);
    
    res.send(inlinks);
});


// Always return array with 3 values - pad spaces
function tempPadOutValues(arr) {
    return arr.concat(Array(3).fill('placeholder value'))
        .slice(0, 3);
}


module.exports = router;