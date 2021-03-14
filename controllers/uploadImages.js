const db = require('../database/mongoImages');
const img = require('../models/image');

exports.getUpload = (req, res) => {
    res.render('upload', { pageTitle: 'ejs is correctly'});
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
        console.log(file.originalname)
        let img = {
            "fileName": file.originalname,
            "data": file.buffer
        }
        imageArray.push(img);
    });

    db.saveImages(imageArray);
    

    // axios.post('https://staging.gather.town/api/uploadImage', {
    //     bytes: imgBytes,
    //     spaceId: spaceId
    // })
    // .then(function(response){
    //     console.log(response);
    // })
    // .catch({funciton(error){
    //     console.log(error)
    // }})

    // make getRoom call to get all the room info && send images to gather storage and get image paths in response
    // Promise.all([
    //         getRoom(apiKey, spaceId, mapId), 
    //         uploadImagesToStaging(imgArray, spaceId)
    //     ])
    //     .then((results) => 
    //         results.forEach((result) =>
    //             console.log(result.value)
    //         ));



    // create new poster objects, plug into objets array in from getRoom

    // call to setMap w/ updated information

    res.redirect('/success')
};


const getRoom = async (userKey, userSpace, userMap) => {
    try {
        const response = axios.get('https://gather.town/api/getMap', {
            params: {
                apiKey: userKey,
                spaceId: userSpace,
                mapId: userMap
            }
        })
        return response;
    } catch (error) {
        res.redirect('/fail')
        return;
    }
}

const uploadImagesToStaging = async (images, userSpaceId) => {
    let axiosArray = [];
    let imageLinks = [];
    Array.from(images).forEach(image => {

        let newPromise = axios({
            method: 'post',
            url: 'https://staging.gather.town/api/uploadImage',
            data: {
                bytes: image.buffer,
                spaceId: userSpaceId
            }
        })

        axiosArray.push(newPromise);
    });

    try {
        const responseArray = axios.all(axiosArray);
        return responseArray;
    } catch (error) {
        res.redirect('/fail')
        return;
    }
    // axios
    //     .all(axiosArray)
    //     .then(axios.spread((...responses) =>
    //         responses.forEach(res => imageLinks.push(res.data))
    //     ))
    //     .catch(error => console.log(error));

    // return imageLinks;
}