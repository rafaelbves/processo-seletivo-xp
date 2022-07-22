const {expect} = require('chai');
const sinon = require('sinon');

const ativosService = require('../../services/ativosService');
const model = require('../../models/models');

const modelClientsAssets = [
  {
    'codCliente': 1,
    'codAtivo': 2,
    'qtdeAtivo': '100',
    'valor': '18.22',
  },
  {
    'codCliente': 2,
    'codAtivo': 2,
    'qtdeAtivo': '100',
    'valor': '18.22',
  },
];

const modelClientsBalance = [
  {
    'codCliente': 1,
    'saldo': '9000.00',
  },
  {
    'codCliente': 2,
    'saldo': '18250.00',
  },
  {
    'codCliente': 3,
    'saldo': '1500.00',
  },
];

const modelGetAssetsAvailable = [
  {
    'codAtivo': 2,
    'qtdeAtivo': '900',
    'valor': '18.22',
  },
];

describe('Retorna a lista de ativos que o cliente possui', async () => {
  before(() => {
    sinon.stub(model, 'getClientsAssets').resolves(modelClientsAssets);
    sinon.stub(model, 'getClientsBalance').resolves(modelClientsBalance);
  });

  after(() => {
    model.getClientsAssets.restore();
    model.getClientsBalance.restore();
  });

  it('cliente nao exist', async () => {
    try {
      await ativosService.getAssetsByClient('5');
    } catch (err) {
      expect(err).to.have.property('status').to.equal(404);
      expect(err).to.have.property('message')
          .to.equal('cliente não encontrado');
    };
  });

  it('nenhum ativo encontrado para esse cliente', async () => {
    try {
      await ativosService.getAssetsByClient('3');
    } catch (err) {
      expect(err).to.have.property('status').to.equal(404);
      expect(err).to.have.property('message')
          .to.equal('nenhum ativo encontrado para esse cliente');
    };
  });

  it('o cliente possui o ativo', async () => {
    const result = await ativosService.getAssetsByClient('1');

    expect(result).to.have.property('status').to.equal(200);
    expect(result.message).to.be.a('array').lengthOf(1);
    expect(result.message[0]).to.have.property('codCliente');
    expect(result.message[0]).to.have.property('codAtivo');
    expect(result.message[0]).to.have.property('qtdeAtivo');
    expect(result.message[0]).to.have.property('valor');
  });
});

describe('localiza o ativo pelo id', async () => {
  before(() => {
    sinon.stub(model, 'getAssetsAvailable').resolves(modelGetAssetsAvailable);
  });
  after(() => {
    model.getAssetsAvailable.restore();
  });

  it('o ativo nao existe', async () => {
    try {
      await ativosService.getAssetsById('1');
    } catch (err) {
      expect(err).to.have.property('status').to.equal(404);
      expect(err).to.have.property('message')
          .to.equal('ativo não encontrado');
    }
  });

  it('o ativo existe e é retornado', async () => {
    const result = await ativosService.getAssetsById('2');

    expect(result).to.have.property('status').to.equal(200);
    expect(result.message).to.be.a('object');
    expect(result.message).to.have.property('codAtivo');
    expect(result.message).to.have.property('qtdeAtivo');
    expect(result.message).to.have.property('valor');
  });
});
