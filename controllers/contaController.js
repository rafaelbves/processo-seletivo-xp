const contaServices = require('../services/contaServices');

const postDeposit = async (req, res, next) => {
  const {body} = req;
  try {
    const {status, message} = await contaServices.postDeposit(body);
    return res.status(status).json({message});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postDeposit,
};
