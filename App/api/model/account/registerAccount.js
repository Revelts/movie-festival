const { INVALID_USERNAME, INVALID_PASSWORD, INVALID_EMAIL, SUCCESS_CREATE_ACCOUNT, ACCOUNT_EXISTS } = require("../../../../Shared/constant");
const hashRound = Number.isNaN(process.env.BCRYPT_ROUND_HASH) ? 12 : +process.env.BCRYPT_ROUND_HASH;
const bcrypt = require('bcryptjs');
const accountModel = require("../../../model/accountModel");

module.exports = (req, res) => {
  try {
    const {
        username,
        email,
        password
    } = req.body;

    if(username == null || username === '') {
        return res.status(404).json({error: `${INVALID_USERNAME}`})
    }
    if(email == null || email === '') {
        return res.status(404).json({error: `${INVALID_EMAIL}`})
    }
    if(password == null || password === '') {
        return res.status(404).json({error: `${INVALID_PASSWORD}`})
    }

    const accountInfo = {
        username: username,
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(hashRound))        
    }

    accountModel.create(accountInfo).then((data) => {
        return res.status(200).json({message: `${SUCCESS_CREATE_ACCOUNT}`, data});
    }).catch((error) => {
        return res.status(500).json({error: `${ACCOUNT_EXISTS}`, errMessage: error.message});
    });

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};