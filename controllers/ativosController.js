const ativosService = require('../services/ativosService');

const getAssetsByClient = async (req, res, next) => {
  const {codCliente} = req.params;
  try {
    const {status, message} = await ativosService.getAssetsByClient(codCliente);
    return res.status(status).json({message});
  } catch (err) {
    next(err);
  }
};

const getAssetsById = async (req, res, next) => {
  const {codAtivo} = req.params;
  try {
    const {status, message} = await ativosService.getAssetsById(codAtivo);
    return res.status(status).json({message});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssetsByClient,
  getAssetsById,
};
