// do I need to put images in a db?
// almost certianly no .. this is just an extra step
// but this is my first nodejs app and I wanted to try wiring in mongo

const getDb = require('../util/databaseConfig').getDb;

const saveImages = (images) => {
    const db = getDb();
    db.collection('images')
        .insertMany(images)
        .then(result =>
            console.log(result))
        .catch(err => {
            console.log(err)
        });
}

const getImages = (fileNames) => {
    const db = getDb();
    let images = db.collection('images')
        .find({
            fileName: {$in: fileNames}
        })
}

exports.saveImages = saveImages;