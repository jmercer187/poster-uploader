const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const uploadRoutes = require('./routes/upload');
const responseRoutes = require('./routes/response')

console.log("whaddup");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(uploadRoutes);
app.use(responseRoutes);

app.use((req, res) => {
    res.status(404)
        .sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(8080);