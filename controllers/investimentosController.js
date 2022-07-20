const investimentosService = require('../services/investimentosService');

const postBuyOrder = async (req, res, next) => {
  const { body } = req;
  try {
    const {status, message} = await investimentosService.postBuyOrder(body);
    return res.status(status).json({ message });

  } catch (err) {
    next(err)
  }
  
};

const postSellOrder = async (req, res, next) => {
  const { body } = req;
  try {
    const {status, message} = await investimentosService.postSellOrder(body);
    return res.status(status).json({ message });

  } catch (err) {
    next(err)
  }
  
};

module.exports = {
  postBuyOrder,
  postSellOrder,
}
