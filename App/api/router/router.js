const express = require('express');
const router = express.Router();
const multer = require('../initiation/multer-config');
const accountRouter = require('./accountrouter');

const checkApiKey = require('../initiation/check-api-key');
const getMovie = require('../model/movie/getMovie');
const getStatistics = require('../model/movie/getStatistics');
const insertMovie = require('../model/movie/insertMovie');
const updateMovie = require('../model/movie/updateMovie');
const updateStatistics = require('../model/movie/updateStatistics');

router.post('/insertmovie', multer.single('video'), checkApiKey, insertMovie);
router.put('/updatemovie/:movieId', multer.single('video'), checkApiKey, updateMovie);
router.put('/updatestatistics', checkApiKey, updateStatistics);
router.get('/mostviewed/:type', checkApiKey, getStatistics);
router.get('/getmovie', checkApiKey, getMovie);
router.use('/account', accountRouter);

module.exports = router;