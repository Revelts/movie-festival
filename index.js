require('dotenv').config();
const initiateExpress = require('./App/api/initiation/init');
const sequelize = require('./App/connection/connection');
const path = require('path');
const fs = require('fs');

const initServer = async () => {
    try {
        await sequelize.authenticate();
        const filesDir = path.join(path.dirname(require.main.filename), "uploads");
        if (!fs.existsSync(filesDir)){
            fs.mkdirSync(filesDir);
        }
        initiateExpress();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

initServer();