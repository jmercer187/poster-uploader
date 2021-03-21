const axios = require('axios');

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
        error.data;
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
        })
        .catch(error => {
            console.error('sending images to staging hit an error')
            error.data;
        });

    return imgCallResults;
}

exports.returnImageLinksArray = returnImageLinksArray;

