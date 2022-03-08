const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { INVALID_PASSWORD, ACCOUNT_NOT_FOUND, SUCCESS_LOGIN, PASSWORD_MISMATCH, INVALID_ACCOUNT_NAME } = require("../../../../Shared/constant");
const accountModel = require("../../../model/accountModel");

module.exports = async (req, res) => {
  try {
    const {
      username,
      email,
      password
    } = req.body;

    if(username == null && email == null) {
      return res.status(404).json({error: `${INVALID_ACCOUNT_NAME}`})
    }

    if(password == null || password === '') {
      return res.status(404).json({error: `${INVALID_PASSWORD}`})
    }

    let condition = { [Op.or]: [{
      username: username || null,
    },{
      email: email || null
    }]};

    const accountData = await accountModel.findOne({where: condition});
    if(accountData) {
      return bcrypt.compare(password, accountData.password).then((response) => {
        if(response === true) {
          return res.status(202).json({message: `${SUCCESS_LOGIN}`});
        }
        return res.status(400).json({error: `${PASSWORD_MISMATCH}`});
      });
    }

    return res.status(404).json({error: `${ACCOUNT_NOT_FOUND}`})

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};