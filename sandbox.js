// const fs = require('fs/promises')

// const getImage = async(fileName) => {
//     let data = await fs.readFile('./images/'+fileName)
//     let image = {
//         fileName: fileName,
//         data: data
//     }
//     return image
// }

// const getImagePromiseArray = async() => {
//     let array = await Promise.resolve(fs.readdir('./images/'))
//         .then(fileNames => {
//             let imagePromiseArray = []
//             fileNames.forEach( file => {
//                 let imagePromise = getImage(file)
//                 imagePromiseArray.push(imagePromise)
//             })
//             return imagePromiseArray
//         })
//         .catch(err => console.log(err))

//     array = await Promise.all(array)
//         .then(results => {return results})

//     return array;
// }



// let img = [
//     {
//     fileName: '01-D__enterprise.png',
//     url: 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/HHZcGPqIP2MXnxY5/EgdOIC5f1ruuBCjj6ZD9u0'
//     },
//     {
//     fileName: '01-P__enterprise.png',
//     url: 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/HHZcGPqIP2MXnxY5/asthOdj7vYKWrXODfFN6V3'
//     },
//     {
//     fileName: '02-D__enterprise.png',
//     url: 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/HHZcGPqIP2MXnxY5/yZIBBAjoGIiyoz8O7r7kck'
//     },
//     {
//     fileName: '02-P__enterprise.png',
//     url: 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/HHZcGPqIP2MXnxY5/YpDCaDbiobvupqwSSv5Es2'
//     },
//     {
//     fileName: '___internalSprite___posterBlack.png',
//     url: 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/HHZcGPqIP2MXnxY5/tsvz8HL9SY2WKNUS228YbV'
//     },
//     {
//     fileName: '___internalSprite___posterBlue.png',
//     url: 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/HHZcGPqIP2MXnxY5/M1EsFlF3PWRmlEwbHG3rkn'
//     }
// ]

// const spriteRegex = /^___internalSprite___.+/
// let userImages = []
// let posterSprites = []
// for (i=0;i<img.length;i++){
//     let fileName = img[i].fileName
//     if (fileName.match(spriteRegex)){
//         posterSprites.push(img[i])
//     } else {
//         userImages.push(img[i])
//     }
// }

// console.log(posterSprites)