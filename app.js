const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
// const expressHbs = require('express-handlebars');

const uploadRoutes = require('./routes/upload');
const responseRoutes = require('./routes/response')

console.log("whaddup");

const app = express();

// app.engine('hbs', expressHbs({ extname: '.hbs' }));
// app.set('view engine', 'hbs');

const imgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g,"-") + '__' + file.originalname) // windows doesn't like having ":" in the file path name
    }
})

const imgFilter = (req, file, cb) => {

    console.log("file type: " + file.mimetype);

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/tif' || file.mimetype === 'image/tiff' || file.mimetype === 'application/pdf'){
        cb(null, true);
    } else {
        cb(null, false);
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