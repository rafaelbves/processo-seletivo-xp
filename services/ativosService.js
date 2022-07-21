const model = require('../models/models');

const clientValidation = async (searchedClientAssets, codCliente) => {
  if (searchedClientAssets.length === 0) {
    const allClients = await model.getClientsBalance();
    const searchedClient = allClients
        .filter((client) => client.codCliente === codCliente);
    if (searchedClient.length === 0) {
      throw new Error(404, 'cliente não encontrado');
    }
    throw new Error(404, 'nenhum ativo encontrado para esse cliente');
  };
};

const getAssetsByClient = async (codCliente) => {
  const allClientsAssets = await model.getClientsAssets();

  const searchedClientAssets = allClientsAssets
      .filter((clientAsset) => clientAsset.codCliente === codCliente);

  await clientValidation(searchedClientAssets, codCliente);

  return {status: 200, message: searchedClientAssets};
};

module.exports = {
  getAssetsByClient,
};
