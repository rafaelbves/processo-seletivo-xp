const model = require('../models/models');
const {HttpError} = require('../middleware/errorHandler');

const clientValidation = async (searchedClientAssets, codCliente) => {
  if (searchedClientAssets.length === 0) {
    const allClients = await model.getClientsBalance();
    const searchedClient = allClients
        .filter((client) => client.codCliente === parseInt(codCliente));
    if (searchedClient.length === 0) {
      throw new HttpError(404, 'cliente não encontrado');
    }
    throw new HttpError(404, 'nenhum ativo encontrado para esse cliente');
  };
};

const assetValidation = (searcherAsset) => {
  if (!searcherAsset) {
    throw new HttpError(404, 'ativo não encontrado');
  }
};

const getAssetsByClient = async (codCliente) => {
  const allClientsAssets = await model.getClientsAssets();
  const searchedClientAssets = allClientsAssets
      .filter((clientAsset) => {
        return parseInt(clientAsset.codCliente) === parseInt(codCliente);
      });

  await clientValidation(searchedClientAssets, parseInt(codCliente));

  return {status: 200, message: searchedClientAssets};
};

const getAssetsById = async (codAtivo) => {
  const allAssetsAvailable = await model.getAssetsAvailable();

  console.log(allAssetsAvailable);
  const searcherAsset = allAssetsAvailable
      .find((asset) => asset.codAtivo === parseInt(codAtivo));

  assetValidation(searcherAsset);

  return {status: 200, message: searcherAsset};
};

module.exports = {
  getAssetsByClient,
  getAssetsById,
};
