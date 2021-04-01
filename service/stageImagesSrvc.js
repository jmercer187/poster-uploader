const fs = require('fs/promises')
const axios = require('axios');

const postImage = async(img, spaceId) => {
    let response = await axios.post('https://gather.town/api/uploadImage', {
        spaceId: spaceId,
        bytes: img.data
    });
    let imgUrl = {
        fileName: img.fileName,
        url: response.data
    }
    return imgUrl;
}

const returnImageLinksArray = async(images, spaceId) => {  
    axiosPromiseArray = [];
    
    // we need these images of the poster board sprites stages as well
    // this might not work???? do I need to wait for the file read promise to be resolved before kicking it up into the axios promise array?
    // fs.readdir('./images/', (err, files) => {
    //     files.forEach(file => {
    //         let img = {
    //             fileName: file,
    //             data: fs.promises.readFile('./images/'+file, (err, data) => {
    //                 if (err) throw err
    //             })
    //         }
    //         images.push(img)
    //     })
    // })

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

