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

    const outlinks = await WikipediaReference
        .find({ title: articleTitle });
    
    console.log('found ' + outlinks);
    
    res.send(outlinks);
});

// Get all articles that reference requested page
router.get("/inlinks/:articleTitle", async (req, res) => {
    let articleTitle = req.params.articleTitle.toLowerCase();

    console.log('Looking up pages referencing ' + articleTitle);

    const inlinks = await WikipediaReference
        .find({ linked_article_title: articleTitle });
    
    console.log('found ' + inlinks);
    
    res.send(inlinks);
});



module.exports = router;