const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const uploadRoutes = require('./routes/upload');
const responseRoutes = require('./routes/response')

console.log("whaddup");

const app = express();

const imgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g,"-") + '__' + file.originalname) // windows doesn't like having ":" in the file path name
    }
})

const imgFilter = (req, file, cb) => {
    const fileSize = Math.round(file.size / 1024);
    if (fileSize <= 3000) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/tif' || file.mimetype === 'image/tiff' || file.mimetype === 'application/pdf'){
            cb(null, true);
        } else {
            cb(null, false); // wrong file type
            }
    } else {
        cb(null, false); // file too large >3mb
    }
};

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: imgStorage, fileFilter: imgFilter}).array('images'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(uploadRoutes);
app.use(responseRoutes);

app.use((req, res) => {
    res.status(404)
        .sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(8080);