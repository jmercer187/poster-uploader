const getDb = require('../util/database').getDb;

const saveImages = (images) => {
    const db = getDb();
    db.collection('images')
        .insertMany([images])
        .then(result =>
            console.log(result))
        .catch(err => {
            console.log(err)
        });
}

// const getImages = (fileNames) => {
//     const db = getDb();
//     db.collection('images')
//         .find({
//             fileName: {$in: fileNames}
//         })
// }

exports.saveImages = saveImages;