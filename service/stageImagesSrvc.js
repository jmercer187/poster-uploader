const axios = require('axios');
const { Result } = require('express-validator');

const postImage = async(img, spaceId) => {
    try {
        let response = await axios.post('https://gather.town/api/uploadImage', {
            spaceId: spaceId,
            bytes: img.data
        });
        let imgUrl = {
            fileName: img.fileName,
            url: response.data
        }
        return imgUrl;
    } catch (error){
        console.error('we have hit an error uploading ' + img.fileName);
    }
}

const returnImageLinksArray = async(images, spaceId) => {  
    axiosPromiseArray = [];
    Array.from(images).forEach(img => {
        let axiosPromise = postImage(img, spaceId);
        axiosPromiseArray.push(axiosPromise);
    });

    const imgCallResults = await Promise.all(axiosPromiseArray)
        .then(function(results) {
            return results;
        });

    return imgCallResults;
}














const uploadImagesToStaging = async (images, userSpaceId) => {
    let axiosArray = [];
    let imageLinks = [];

    console.log(images);

    Array.from(images).forEach(image => {

        let newPromise = axios({
            method: 'post',
            url: 'https://staging.gather.town/api/uploadImage',
            data: {
                bytes: image.data,
                spaceId: userSpaceId
            }
        })

        axiosArray.push(newPromise);
    });

    

    // try {
    //     const responseArray = axios.all(axiosArray);
    //     return responseArray;
    // } catch (error) {
    //     res.redirect('/fail')
    //     return;
    // }

    axios
        .all(axiosArray)
        .then(axios.spread((...responses) =>
            responses.forEach(res => imageLinks.push(res.data))
        ))
        .catch(error => console.log(error));

    return imageLinks;
}

exports.returnImageLinksArray = returnImageLinksArray;
exports.uploadImagesToStaging = uploadImagesToStaging;





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




