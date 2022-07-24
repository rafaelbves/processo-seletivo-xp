const {expect} = require('chai');
const sinon = require('sinon');

const investimentosService = require('../../services/investimentosService');
const model = require('../../models/models');


const mockClientsBalance = [
  {
    'codCliente': 1,
    'saldo': '9000.00',
  },
  {
    'codCliente': 2,
    'saldo': '100.00',
  },
];

const mockGetAssetsAvailable = [
  {
    'codAtivo': 2,
    'qtdeAtivo': '900',
    'valor': '18.22',
  },
  {
    'codAtivo': 3,
    'qtdeAtivo': '50',
    'valor': '18.22',
  },
];

const mockClientsAssets = [
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

// eslint-disable-next-line max-len
describe('02 - faz a validação do pedido /investimentos/comprar||vender', async () => {
  it('cliente não informado', async () => {
    const wrongBody = {
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    try {
      await investimentosService.postBuyOrder(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor identificar o cliente');
    };

    try {
      await investimentosService.postSellOrder(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor identificar o cliente');
    };
  });

  it('ativo não informado', async () => {
    const wrongBody = {
      codCliente: 1,
      qtdeAtivo: 100,
    };

    try {
      await investimentosService.postBuyOrder(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor identificar qual ativo deseja comprar/vender');
    };

    try {
      await investimentosService.postSellOrder(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor identificar qual ativo deseja comprar/vender');
    };
  });

  it('quantidade não informado', async () => {
    const wrongBody = {
      codCliente: 1,
      codAtivo: 2,
    };

    try {
      await investimentosService.postBuyOrder(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal(
              'por favor especificar a quantidade de ativos que deseja comprar',
          );
    };

    try {
      await investimentosService.postSellOrder(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal(
              'por favor especificar a quantidade de ativos que deseja comprar',
          );
    };
  });

  it('quantidade negativa', async () => {
    const wrongBody = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: -100,
    };

    try {
      await investimentosService.postBuyOrder(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('quantidade não pode ser negativa');
    };

    try {
      await investimentosService.postSellOrder(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('quantidade não pode ser negativa');
    };
  });
});

describe('03 - compra uma ativo /investimentos/comprar', async () => {
  before(() => {
    sinon.stub(model, 'getClientsBalance').resolves(mockClientsBalance);
    sinon.stub(model, 'getAssetsAvailable').resolves(mockGetAssetsAvailable);
  });

  after(() => {
    model.getClientsBalance.restore();
    model.getAssetsAvailable.restore();
  });

  it('cliente nao existe', async () => {
    const buyRequest = {
      codCliente: 3,
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    try {
      await investimentosService.postBuyOrder(buyRequest);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(404);
      expect(err).to.have.property('message')
          .to.equal('cliente nao encontrado');
    };
  });

  it('ativo não encontrado', async () => {
    const buyRequest = {
      codCliente: 1,
      codAtivo: 1,
      qtdeAtivo: 100,
    };

    try {
      await investimentosService.postBuyOrder(buyRequest);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(404);
      expect(err).to.have.property('message')
          .to.equal('ativo nao encontrado');
    };
  });

  it('não tem saldo para a compra', async () => {
    const buyRequest = {
      codCliente: 2,
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    try {
      await investimentosService.postBuyOrder(buyRequest);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(412);
      expect(err).to.have.property('message')
          .to.equal('saldo insuficiente');
    };
  });

  it('quantidade indisponivel para a compra', async () => {
    const buyRequest = {
      codCliente: 1,
      codAtivo: 3,
      qtdeAtivo: 100,
    };

    try {
      await investimentosService.postBuyOrder(buyRequest);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(412);
      expect(err).to.have.property('message')
          .to.equal('quantidade indisponível para compra');
    };
  });

  it('erro ao inserir o pedido de compra', async () => {
    const buyRequest = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    sinon.stub(model, 'buyOrSellRequest').resolves({});

    try {
      await investimentosService.postBuyOrder(buyRequest);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(500);
      expect(err).to.have.property('message')
          .to.equal('alguma coisa deu errado!');
    };

    model.buyOrSellRequest.restore();
  });

  it('erro ao atualizar o saldo do cliente', async () => {
    const buyRequest = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    const undoAction = sinon.stub(model, 'undoAction').resolves(true);

    undoAction();
    sinon.stub(model, 'buyOrSellRequest').resolves({insertId: 1});
    sinon.stub(model, 'countBalanceMovement').resolves({});


    try {
      await investimentosService.postBuyOrder(buyRequest);
    } catch (err) {
      model.buyOrSellRequest.restore();
      model.countBalanceMovement.restore();
      model.undoAction.restore();

      expect(undoAction.calledWith('compras_vendas', 1)).to.be.equal(true);
      expect(err).to.have.property('status').to.equal(500);
      expect(err).to.have.property('message')
          .to.equal('alguma coisa deu errado!');
    };
  });

  it('compra realisada com sucesso', async () => {
    const buyRequest = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    sinon.stub(model, 'buyOrSellRequest').resolves({insertId: 1});
    sinon.stub(model, 'countBalanceMovement').resolves({insertId: 1});
    try {
      const result = await investimentosService.postBuyOrder(buyRequest);
      expect(result).to.have.property('status').to.equal(201);
      expect(result).to.have.property('message')
          .to.equal('compra realisada com sucesso');
      model.buyOrSellRequest.restore();
      model.countBalanceMovement.restore();
    } catch (err) {
      model.buyOrSellRequest.restore();
      model.countBalanceMovement.restore();
      expect(!err).to.equal(true);
    }
  });
});


describe('04 - vender uma ativo /investimentos/vender', async () => {
  before(() => {
    sinon.stub(model, 'getClientsBalance').resolves(mockClientsBalance);
    sinon.stub(model, 'getClientsAssets').resolves(mockClientsAssets);
  });

  after(() => {
    model.getClientsBalance.restore();
    model.getClientsAssets.restore();
  });

  it('cliente nao existe', async () => {
    const sellRequest = {
      codCliente: 3,
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    try {
      await investimentosService.postSellOrder(sellRequest);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(404);
      expect(err).to.have.property('message')
          .to.equal('cliente nao encontrado');
    };
  });

  it('cliente não tem o ativo para vende-lo', async () => {
    const sellRequest = {
      codCliente: 1,
      codAtivo: 1,
      qtdeAtivo: 100,
    };

    try {
      await investimentosService.postSellOrder(sellRequest);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(404);
      expect(err).to.have.property('message')
          .to.equal('voce nao possui esse ativo para vende-lo');
    };
  });

  it('cliente não tem a quantidade de ativos que deseja vender', async () => {
    const sellRequest = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: 1000,
    };

    try {
      await investimentosService.postSellOrder(sellRequest);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(412);
      expect(err).to.have.property('message')
          .to.equal('voce nao possui essa quantidade para venda');
    };
  });

  it('erro ao inserir o pedido de venda', async () => {
    const sellRequest = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    sinon.stub(model, 'buyOrSellRequest').resolves({});

    try {
      await investimentosService.postSellOrder(sellRequest);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(500);
      expect(err).to.have.property('message')
          .to.equal('alguma coisa deu errado!');
    };

    model.buyOrSellRequest.restore();
  });

  it('erro ao atualizar o saldo do cliente', async () => {
    const sellRequest = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    const undoAction = sinon.stub(model, 'undoAction').resolves(true);

    undoAction();
    sinon.stub(model, 'buyOrSellRequest').resolves({insertId: 1});
    sinon.stub(model, 'countBalanceMovement').resolves({});


    try {
      await investimentosService.postSellOrder(sellRequest);
    } catch (err) {
      model.buyOrSellRequest.restore();
      model.countBalanceMovement.restore();
      model.undoAction.restore();

      expect(undoAction.calledWith('compras_vendas', 1)).to.be.equal(true);
      expect(err).to.have.property('status').to.equal(500);
      expect(err).to.have.property('message')
          .to.equal('alguma coisa deu errado!');
    };
  });

  it('venda realisada com sucesso', async () => {
    const sellRequest = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: 100,
    };

    sinon.stub(model, 'buyOrSellRequest').resolves({insertId: 1});
    sinon.stub(model, 'countBalanceMovement').resolves({insertId: 1});
    try {
      const result = await investimentosService.postSellOrder(sellRequest);
      expect(result).to.have.property('status').to.equal(201);
      expect(result).to.have.property('message')
          .to.equal('venda realisada com sucesso');
      model.buyOrSellRequest.restore();
      model.countBalanceMovement.restore();
    } catch (err) {
      model.buyOrSellRequest.restore();
      model.countBalanceMovement.restore();
      expect(!err).to.equal(true);
    }
  });
});
