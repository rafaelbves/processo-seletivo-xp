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

const getAssetsByClient = async (codCliente) => {
  const allClientsAssets = await model.getClientsAssets();
  const searchedClientAssets = allClientsAssets
      .filter((clientAsset) => {
        return parseInt(clientAsset.codCliente) === parseInt(codCliente) &&
            clientAsset.qtdeAtivo > 0;
      });

  await clientValidation(searchedClientAssets, parseInt(codCliente));

  return {status: 200, message: searchedClientAssets};
};

module.exports = {
  getAssetsByClient,
};
