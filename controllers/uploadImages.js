const { render } = require('ejs');
const { validationResult } = require('express-validator');

const roomSrvc = require('../service/roomSrvc');
const imgSrvc = require('../service/stageImagesSrvc');
const updtRmSrvc = require('../service/updateRoomSrvc');

const pageTitle = 'Poster Uploader'

const filesNamesDoNotFollowPrescribedStructure = (files) => {
    const regex = new RegExp('^\\d{2}-(P|D)__.+');
    Array.from(files).forEach(file => {
        if (regex.test(file.originalname)!==true){
            return true;
        }
    });
    return false;
}

exports.getUpload = (req, res) => {
    res.render('upload', { pageTitle });
};

exports.postUpload = (req, res) => {
    
    const errors = validationResult(req);
    // TODO: get this out of the controller and into a validation file
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
    } else if (filesNamesDoNotFollowPrescribedStructure(req.files)===true) {
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

    // TODO: big value add if we can convert PDFs to png files
    Array.from(req.files).forEach(file => {
        let img = {
            fileName: file.originalname,
            data: file.buffer
        }
        imageArray.push(img);
    });  

    Promise.all([
            //make getRoom call to get current room info
            roomSrvc.getRoom(apiKey, spaceId, mapId)
                .catch(error => {
                    alert =  error.response.data
                    console.log(alert);
                    throw new Error(alert);
                }), 
            //send images to gather storage and get image paths in response
            imgSrvc.returnImageLinksArray(imageArray, spaceId)
                .catch(error => {
                    alert = error.response.data
                    console.log(alert);
                    throw new Error(alert);
                }), 
        ])
        .then(function(results) {
            // create new poster objects, plug into objets array in from getRoom
            let updatedRoom = null;
            try { 
                updatedRoom = updtRmSrvc.updateRoom(results[0], results[1], replaceAll);
            } catch (err) {
                console.log(err)
                res.render('fail', {
                    pageTitle: "Oh no",
                    errorMessage: err
                })
                return;
            }
            
            // post to setMap w/ updated information
            roomSrvc.postRoom(apiKey, spaceId, mapId, updatedRoom)
                .catch(error => {
                    alert = error.response.data
                    console.log(alert);
                    throw new Error(alert);
                }),
            res.redirect('/success')
        })
        .catch(error => {
            console.error("an error was encountered" + error);
            const alert = [{msg: error}]
            res.render('upload', {
                pageTitle,
                alert
            })
            return;
        });

};