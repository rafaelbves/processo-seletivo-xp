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

const postWithdraw = async (req, res, next) => {
  const {body} = req;
  try {
    const {status, message} = await contaServices.postWithdraw(body);
    return res.status(status).json({message});
  } catch (err) {
    next(err);
  }
};

const getClientBalance = async (req, res, next) => {
  const {codCliente} = req.params;
  try {
    const {status, message} = await contaServices.getClientBalance(codCliente);
    return res.status(status).json({message});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postDeposit,
  postWithdraw,
  getClientBalance,
};
