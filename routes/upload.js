const path = require('path');

const express = require('express');
const axios = require('axios');

const rootDir = require('../util/path');

const router = express.Router();

async function getRoom(userKey, userSpace, userMap) {
    try {
        const response = axios.get('https://gather.town/api/getMap', {
            params: {
                apiKey : userKey,
                spaceId : userSpace,
                mapId : userMap
            }
        })

        console.log(response);
        return response;

    } catch (error) {
        res.redirect('/fail')
        return;
    }
}

router.get('/upload', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'upload.html'));
})

router.post('/upload', (req, res) => {

    const apiKey = req.body.apiKey;
    const spaceId = req.body.spaceId;
    const mapId = req.body.mapId;
    const imgArray = req.files;

    console.log(req.body);
    console.log(req.files);

    if (imgArray.length < 1) { // means multer didn't let anything get past the validation and into the files array
        res.redirect('/fail')
        console.log("bailed out in upload route")
        return;
    }

    axios.get('https://gather.town/api/getMap', {
            params: {
                apiKey : apiKey,
                spaceId : spaceId,
                mapId : mapId
            }
        })
        .then(function (response){
            console.log("GET MAP got back: " + response.status);
            console.log(response.data);
        })
        .catch(function (error){s
            console.log("GET MAP got an error! " + error);
        })
    

    // pull out map and space id

    // make getRoom call to get all the room info

    // add in poster info and private spaces and also do it in a way that maintains symmetry and all tht (easier said than done...)

    // actually do the gather town api call with the updated room info

    // need to figure out how to do logic that dicates redirect to success or pass based on status code response from gather town api call
    res.redirect('/success')
})

module.exports = router;