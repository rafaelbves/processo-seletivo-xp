const models = require('../models/models')
const { HttpError } = require('../middleware/errorHandler');

const validationRequest = (body) => {
  const { codCliente, codAtivo, qtdeAtivo } = body;
  if(!codCliente) throw new HttpError(400, 'por favor identificar o cliente');
  if(!codAtivo) throw new HttpError(400, 'por favor identificar qual ativo deseja comprar/vender');
  if(!qtdeAtivo) throw new HttpError(400, 'por favor especificar a quantidade de ativos que deseja comprar');
  if(qtdeAtivo < 0) throw new HttpError(400, 'quantidade não pode ser negativa');
}

const validationBuyOrder = (qtdeAtivo, buyer, requestedAsset) => { 
  if(!buyer) {
    throw new HttpError(403, 'cliente inválido');
  };

  if(!requestedAsset) {
    throw new HttpError(404, 'ativo nao encontrado');
  }
  const purchasePrice = qtdeAtivo * parseFloat(requestedAsset.valor);
  const buyerFunds = parseFloat(buyer.saldo);
  if(purchasePrice > buyerFunds) {
    throw new HttpError(412, 'saldo insuficiente');
  }

  const assetsAvailable = parseFloat(requestedAsset.qtdeAtivo);
  if(qtdeAtivo > assetsAvailable) {
    throw new HttpError(412, 'quantidade indisponível para compra');
  }
  
}

const validationSellOrder = (qtdeAtivo, seller, sellerAsset) => { 
  if(!seller) {
    throw new HttpError(403, 'cliente inválido');
  };

  if(!sellerAsset) throw new HttpError(404, 'voce nao possui esse ativo para vende-lo')

  const assetsAvailableForSelling = parseFloat(sellerAsset.qtdeAtivo);
  if(qtdeAtivo > assetsAvailableForSelling) {
    throw new HttpError(412, 'voce nao possui essa quantidde para venda');
  }
  

}

const executeBuyOrder = async (qtdeAtivo, buyer, requestedAsset) => {
  const { codAtivo, valor } = requestedAsset;
  const { codCliente } = buyer;
  const purchasePrice = (parseFloat(qtdeAtivo) * parseFloat(valor)) * -1;

  const buyOrder = await models.buyOrSellRequest({ codCliente, codAtivo, qtdeAtivo });
  if(!buyOrder.insertId) throw new HttpError(500, 'alguma coisa deu errado!');

  const updateFunds = await models.countBalanceMovement({ codCliente, valor: purchasePrice,  transactionType: 'compra' });
  if(!updateFunds.insertId) {
    await models.undoAction('compras_vendas', buyOrder.insertId);
    throw new HttpError(500, 'alguma coisa deu errado!');
  };
}

const executeSellOrder = async (qtdeAtivo, seller, sellerAsset) => {
  console.log(sellerAsset)
  const { codAtivo, valor } = sellerAsset;
  const { codCliente } = seller;
  const sellValue = (parseFloat(qtdeAtivo) * parseFloat(valor));
  const qtdeAtivoSold = qtdeAtivo * -1;

  const sellOrder = await models.buyOrSellRequest({ codCliente, codAtivo, qtdeAtivo: qtdeAtivoSold });
  if(!sellOrder.insertId) throw new HttpError(500, 'alguma coisa deu errado!');

  const updateFunds = await models.countBalanceMovement({ codCliente, valor: sellValue,  transactionType: 'venda' });
  if(!updateFunds.insertId) {
    await models.undoAction('compras_vendas', sellOrder.insertId);
    throw new HttpError(500, 'alguma coisa deu errado!');
  };
}

const postBuyOrder = async (body) => {
  validationRequest(body)
  
  const { codCliente, codAtivo, qtdeAtivo } = body;
  const clients = await models.getClientsBalance();
  const assets = await models.getAssetsAvailable();
 
  const requestedAsset = assets.find((asset) => asset.codAtivo === codAtivo);
  const buyer = clients.find((client) => client.codCliente === codCliente);
  
  validationBuyOrder(qtdeAtivo, buyer, requestedAsset);
  executeBuyOrder(qtdeAtivo, buyer, requestedAsset);


  return { status: 201, message: 'compra realisada com sucesso' };
};

const postSellOrder = async (body) => {
  validationRequest(body)
  
  const { codCliente, codAtivo, qtdeAtivo } = body;
  const clients = await models.getClientsBalance();
  const clientsAssets = await models.getClientsAssets();
 
  const seller = clients.find((client) => client.codCliente === codCliente);
  const sellerAsset = clientsAssets
    .find((clientAsset) => clientAsset.codCliente === codCliente && clientAsset.codAtivo === codAtivo);
  
  validationSellOrder(qtdeAtivo, seller, sellerAsset);
  executeSellOrder(qtdeAtivo, seller, sellerAsset);


  return { status: 201, message: 'venda realisada com sucesso' };
};

module.exports = {
  postBuyOrder,
  postSellOrder,
}
