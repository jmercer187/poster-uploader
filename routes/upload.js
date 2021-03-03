const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/upload', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'upload.html'));
})

router.post('/upload', (req, res) => {

    const spaceId = req.body.spaceId;
    const mapId = req.body.mapId;
    const imgArray = req.files;

    if (imgArray.length < 1){ // means multer didn't let anything get past the validation and into the files array
        res.redirect('/fail')
        return;
    }

    // pull out map and space id

    // make getRoom call to get all the room info

    // add in poster info and private spaces and also do it in a way that maintains symmetry and all tht (easier said than done...)

    // actually do the gather town api call with the updated room info

    // need to figure out how to do logic that dicates redirect to success or pass based on status code response from gather town api call
    res.redirect('/success')
})

module.exports = router;