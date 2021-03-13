const express = require('express');
const axios = require('axios');

const uploadController = require('../controllers/uploadImages');
const responseController = require('../controllers/responses')

const router = express.Router();

router.get('/upload', uploadController.getUpload);
router.post('/upload', uploadController.postUpload);

router.get('/success', responseController.getSuccess);
router.get('/fail', responseController.getFail);

module.exports = router;