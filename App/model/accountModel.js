const Sequelize = require('sequelize');
const db = require('../connection/connection');

const accountModel = db.define('account_model', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true },
    username: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.TEXT , allowNull: false},
    email: { type : Sequelize.STRING , allowNull: false},
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    deletedAt: { type: Sequelize.DATE }
}, {
    tableName: 'user_account',
    paranoid: true
});

accountModel.sync();

module.exports = accountModel;
