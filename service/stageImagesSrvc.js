const axios = require('axios');

const postImage = async(imageData, spaceId) => {
    try {
        const response = await axios.post('https://gather.town/api/getMap', {
            spaceId: spaceId,
            bytes: imageData
        });
        console.log("successfully posted an image to staging");
        return response.data;
    } catch (error){
        console.log("hit an error posting an image to staging")
        console.error(error);
    }
}

const returnImageLinksArray = async(images, spaceId) => {  
    axiosPromiseArray = [];
    images.array.forEach(img => {
        let axiosPromise = postImage(img.data, spaceId);
        axiosPromiseArray.push(axiosPromise);
    });
    Promise.all([axiosPromiseArray])
    .then(function(results) {
        results.forEach(result =>
            console.log(result)
        );
    });
}

exports.returnImageLinksArray = returnImageLinksArray;





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




// const uploadImagesToStaging = async (images, userSpaceId) => {
//     let axiosArray = [];
//     let imageLinks = [];
//     Array.from(images).forEach(image => {

//         let newPromise = axios({
//             method: 'post',
//             url: 'https://staging.gather.town/api/uploadImage',
//             data: {
//                 bytes: image.buffer,
//                 spaceId: userSpaceId
//             }
//         })

//         axiosArray.push(newPromise);
//     });

//     try {
//         const responseArray = axios.all(axiosArray);
//         return responseArray;
//     } catch (error) {
//         res.redirect('/fail')
//         return;
//     }

    // axios
    //     .all(axiosArray)
    //     .then(axios.spread((...responses) =>
    //         responses.forEach(res => imageLinks.push(res.data))
    //     ))
    //     .catch(error => console.log(error));

    // return imageLinks;
//}