const express = require('express');
const app = require('express')();
const bodyParser = require('body-parser');
const randomString = require('random-string');
const router = require('../router/router');

const notifyConnect = () => {
    console.log(`SERVER API CONNECTED TO ${process.env.EXPRESS_API_HOST}:${process.env.EXPRESS_API_PORT}`);
};

const initiateExpress = () => {
    if (!process.env.EXPRESS_API_SECRET_KEY) {
        process.env.EXPRESS_API_SECRET_KEY = randomString({ length: 64 });
        // eslint-disable-next-line no-console
        console.info(`Since you are not setup API key correctly, we generate it for you: ${process.env.EXPRESS_API_SECRET_KEY}`);
    }
    
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json());
    app.use('/api', router);
    
    app.listen(process.env.EXPRESS_API_PORT, process.env.EXPRESS_API_HOST, notifyConnect);
}


module.exports = initiateExpress;
