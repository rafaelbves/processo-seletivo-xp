const {expect} = require('chai');
const sinon = require('sinon');


const investimentosService = require('../../services/investimentosService');
// eslint-disable-next-line max-len
const investimentosController = require('../../controllers/investimentosController');

describe('12 - testa o controller da rota /investimentos', async () => {
  const req = {};
  const res = {};

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
  });

  it('testando a rota /investimentos/comprar', async () => {
    req.body = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: 100,
    };
    const result = {
      status: 200,
      message: 'isso é uma mensagem',
    };

    sinon.stub(investimentosService, 'postBuyOrder').resolves(result);
    await investimentosController.postBuyOrder(req, res);
    investimentosService.postBuyOrder.restore();

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({message: 'isso é uma mensagem'})).to.be.true;
  });

  it('testando a rota /investimentos/vender', async () => {
    req.body = {
      codCliente: 1,
      codAtivo: 2,
      qtdeAtivo: 100,
    };
    const result = {
      status: 200,
      message: 'isso é uma mensagem',
    };

    sinon.stub(investimentosService, 'postSellOrder').resolves(result);
    await investimentosController.postSellOrder(req, res);
    investimentosService.postSellOrder.restore();

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({message: 'isso é uma mensagem'})).to.be.true;
  });
});
