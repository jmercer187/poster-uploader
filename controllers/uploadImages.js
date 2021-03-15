const { Result } = require('express-validator');
const roomSrvc = require('../service/roomSrvc');
const imgSrvc = require('../service/stageImagesSrvc')

exports.getUpload = (req, res) => {
    res.render('upload', { pageTitle: 'ejs is correctly' });
};

exports.postUpload = (req, res) => {

    const apiKey = req.body.apiKey;
    const spaceId = req.body.spaceId;
    const mapId = req.body.mapId;
    const replaceAll = req.body.replaceAll;
    const imageArray = [];

    if (Array.from(req.files).length < 1) { // means multer didn't let anything get past the validation and into the files array
        res.redirect('/fail')
        console.log("bailed out in upload route -> no images in array")
        return;
    }

    Array.from(req.files).forEach(file => {
        let img = {
            "fileName": file.originalname,
            "data": file.buffer
        }
        imageArray.push(img);
    });
    
    //make getRoom call to get all the room info && send images to gather storage and get image paths in response
    Promise.all([
            roomSrvc.getRoom(apiKey, spaceId, mapId), 
            imgSrvc.returnImageLinksArray(imageArray, spaceId)
        ])
        .then(function(results) {
            //results.forEach(result =>
                console.log("promises kept!")
            //);
        });



    // create new poster objects, plug into objets array in from getRoom

    // call to setMap w/ updated information

    res.redirect('/success')
};