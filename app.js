const path = require('path');

const express = require('express');
const multer = require('multer');

const rts = require('./routes/rts');
const errorController = require('./controllers/errors');
//const mongoConnect = require('./util/databaseConfig').mongoConnect;

console.log("welcome to the jungle, where it's all fun and games");
const app = express();

app.set('view engine', 'ejs');

const imgStorage = multer.memoryStorage({
    // destination: (req, file, cb) => {
    //     cb(null, 'uploads');
    // },
    // not doing any physical storage of these so incoming file names /should/ be fine
    // filename: (req, file, cb) => {
    //     cb(null, new Date().toISOString().replace(/:/g, "-") + '+!+' + file.originalname) // windows doesn't like having ":" in the file path name
    // }
})

const imgFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(multer({ storage: imgStorage, fileFilter: imgFilter }).array('posterImg'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(rts);
app.use(errorController.get404);

app.listen(3000);

// a relic from a more sophisticated age
// mongoConnect(() => {
//     app.listen(3000);
// })

