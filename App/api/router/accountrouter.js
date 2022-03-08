const express = require('express');
const checkApiKey = require('../initiation/check-api-key');
const loginAccount = require('../model/account/loginAccount');
const registerAccount = require('../model/account/registerAccount');
const router = express.Router();

router.post('/register', checkApiKey, registerAccount);
router.post('/login', checkApiKey, loginAccount);

module.exports = router;