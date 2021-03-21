const { validationResult } = require('express-validator');
const roomSrvc = require('../service/roomSrvc');
const imgSrvc = require('../service/stageImagesSrvc');
const updtRmSrvc = require('../service/updateRoomSrvc');

const pageTitle = 'Poster Uploader'

exports.getUpload = (req, res) => {
    res.render('upload', { pageTitle });
};

exports.postUpload = (req, res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array()
        res.render('upload', {
            pageTitle,
            alert
        })
        console.log('bailed out in upload post -> failed form validation ' + Array.from(alert).forEach(err => {console.log(err.msg)}))
        return;
    }

    const apiKey = req.body.apiKey;
    const spaceId = req.body.spaceId;
    const mapId = req.body.mapId;
    const replaceAll = req.body.replaceAll;
    const imageArray = [];

    if (Array.from(req.files).length < 1) { // means multer didn't let anything get past the validation and into the files array
        res.redirect('/fail')
        console.log("bailed out in upload post -> no images in array")
        return;
    }

    Array.from(req.files).forEach(file => {
        let img = {
            fileName: file.originalname,
            data: file.buffer
        }
        imageArray.push(img);
    });  

    Promise.all([
            //make getRoom call to get current room info
            roomSrvc.getRoom(apiKey, spaceId, mapId), 
            //send images to gather storage and get image paths in response
            imgSrvc.returnImageLinksArray(imageArray, spaceId)
        ])
        .then(function(results) {
            // create new poster objects, plug into objets array in from getRoom
            let updatedRoom = updtRmSrvc(results[0], results[1], replaceAll);
            // post to setMap w/ updated information
            roomSrvc.postRoom(apiKey, spaceId, mapId, updatedRoom);
            res.redirect('/success')
        })
        .catch(error => {
            console.error("an error was encountered");
        });

    
};