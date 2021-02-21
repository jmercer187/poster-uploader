const path = require('path');

const express = require('express');

const router = express.Router();

router.get('/upload', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'upload.html'));
})