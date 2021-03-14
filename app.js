const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const rts = require('./routes/rts');
const errorController = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;

console.log("welcome to the jungle, where it's all fun and games");
const app = express();


app.set('view engine', 'ejs');

const imgStorage = multer.memoryStorage({
    // destination: (req, file, cb) => {
    //     cb(null, 'uploads');
    // },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, "-") + '__' + file.originalname) // windows doesn't like having ":" in the file path name
    }
})

const imgFilter = (req, file, cb) => {

    console.log("file type: " + file.mimetype);

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/tif' || file.mimetype === 'image/tiff' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: imgStorage, fileFilter: imgFilter }).array('posterImg'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(rts);
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
})

