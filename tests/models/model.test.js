const {expect} = require('chai');
const sinon = require('sinon');

const model = require('../../models/models');
const connection = require('../../models/connection');

const modelInsertPayload = {
  codCliente: 1,
  codAtivo: 1,
  qtdeAtivo: 100,
};

// eslint-disable-next-line max-len
describe('01 - Testa a conexão das funções da camada model com o DB', async () => {
  before(() => {
    const execute = [true];

    sinon.stub(connection, 'execute').resolves(execute);
  });

  after(()=> {
    connection.execute.restore();
  });
  it('testando a função buyOrSellRequest', async () => {
    const response = await model.buyOrSellRequest(modelInsertPayload);

    expect(response).to.be.equal(true);
  });

  it('testando a função countBalanceMovement', async () => {
    const response = await model.countBalanceMovement(modelInsertPayload);

    expect(response).to.be.equal(true);
  });

  it('testando a função getAssetsAvailable', async () => {
    const response = await model.getAssetsAvailable();

    expect(response).to.be.equal(true);
  });

  it('testando a função getClientsAssets', async () => {
    const response = await model.getClientsAssets();

    expect(response).to.be.equal(true);
  });

  it('testando a função getClientsBalance', async () => {
    const response = await model.getClientsBalance();

    expect(response).to.be.equal(true);
  });

  it('testando a função undoAction', async () => {
    const response = await model.undoAction('table', 'id');

    expect(response).to.be.equal(true);
  });
});
