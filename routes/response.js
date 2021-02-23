const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

router.get('/success', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'success.html'));
});

router.get('/fail', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'fail.html'));
});

module.exports = router;