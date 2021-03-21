const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const uploadController = require('../controllers/uploadImages');
const responseController = require('../controllers/responses')

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/upload', uploadController.getUpload);
router.post('/upload', urlencodedParser, [
    check('apiKey', 'You must enter an API Key')
        .isLength({ min: 1}),
    check('spaceId', 'You must enter a SpaceId')
        .isLength({ min: 1}),
    check('mapId', 'You must enter a MapId')
        .isLength({ min: 1}),
    ],
    uploadController.postUpload);

router.get('/success', responseController.getSuccess);
router.get('/fail', responseController.getFail);

module.exports = router;