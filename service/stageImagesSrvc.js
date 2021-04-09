const fs = require('fs/promises')
const axios = require('axios');

const getImage = async(fileName) => {
    let data = await fs.readFile('./images/'+fileName)
    let image = {
        fileName: "___internalSprite___" + fileName,
        data: data
    }
    return image
}

const getImagePromiseArray = async() => {
    let array = await Promise.resolve(fs.readdir('./images/'))
        .then(fileNames => {
            let imagePromiseArray = []
            fileNames.forEach( file => {
                let imagePromise = getImage(file)
                imagePromiseArray.push(imagePromise)
            })
            return imagePromiseArray
        })
        .catch(err => console.log(err))

    array = await Promise.all(array)
        .then(results => {return results})

    return array;
}

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
    
    // we need these images of the poster board sprites stages as well
    let posterSprites = await Promise.resolve(getImagePromiseArray())
                                .catch(error => console.error('getting poster images failed ' + error))

    let allImages = images.concat(posterSprites)
    
    axiosPromiseArray = [];
    Array.from(allImages).forEach(img => {
        let axiosPromise = postImage(img, spaceId);
        axiosPromiseArray.push(axiosPromise);
    }); 

    const imgCallResults = await Promise.all(axiosPromiseArray)
        .then(results => {
            return results;
        })
        .catch(error => {
            console.error('sending images to staging hit an error')
            error.data;
        });

    return imgCallResults;
}

exports.returnImageLinksArray = returnImageLinksArray;

