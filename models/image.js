const getDb = require('../util/database').getDb;

class Image {
    constructor(fileName, data){
        this.fileName = fileName
        this.data = data;
        this.created = Date().toISOString();
    }
}

exports.Image = Image;