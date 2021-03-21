const { render } = require('ejs');
const { validationResult } = require('express-validator');

const roomSrvc = require('../service/roomSrvc');
const imgSrvc = require('../service/stageImagesSrvc');
const updtRmSrvc = require('../service/updateRoomSrvc');

const pageTitle = 'Poster Uploader'

const filesNamesDoNotFollowPrescribedStructure = (files) => {
    const regex = /^\d{2}-(F|P)__/;
    Array.from(files).forEach(file => {
        if (files.match(regex)){
            return false;
        }
    });
    return true;
}

exports.getUpload = (req, res) => {
    res.render('upload', { pageTitle });
};

exports.postUpload = (req, res) => {
    
    const errors = validationResult(req);
    // get this out of the controller and into a validation file
    if(!errors.isEmpty()) {
        const alert = errors.array()
        console.log('bailed out in upload post -> failed form validation');
        res.render('upload', {
            pageTitle,
            alert
        })
        return;
    } else if (Array.from(req.files).length < 1) { // multer didn't let anything get past the validation and into the files array
        const fileError = "Image files must be type .png and less than 3mb in size";
        res.render('upload', {
            pageTitle,
            fileError
        })
        return;
    } else if (Array.from(req.files).length % 2 === 1) {
        const fileError = "Odd number of files submitted ... please make sure you have both a preview and display image";
        res.render('upload', {
            pageTitle,
            fileError
        })
        return;
    } else if (filesNamesDoNotFollowPrescribedStructure(req.files)) {
        const fileError = "File names do not follow the prescribed strucutre ... please make sure file names follow pattern in example";
        res.render('upload', {
            pageTitle,
            fileError
        })
        return;
    }

    const apiKey = req.body.apiKey;
    const spaceId = req.body.spaceId;
    const mapId = req.body.mapId;
    const replaceAll = req.body.replaceAll;
    const imageArray = [];

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
            console.error("an error was encountered", error);
        });

    
};