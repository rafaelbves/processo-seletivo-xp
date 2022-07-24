const {expect} = require('chai');
const sinon = require('sinon');


const ativoService = require('../../services/ativosService');
const ativoController = require('../../controllers/ativosController');

describe('10 - testa o controller da rota /ativos', async () => {
  const req = {};
  const res = {};

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
  });

  it('testando a rota /ativos/cliente/codCliente', async () => {
    req.params = {codCliente: 1};
    const result = {
      status: 200,
      message: 'isso é uma mensagem',
    };

    sinon.stub(ativoService, 'getAssetsByClient').resolves(result);
    await ativoController.getAssetsByClient(req, res);
    ativoService.getAssetsByClient.restore();

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({message: 'isso é uma mensagem'})).to.be.true;
  });

  it('testando a rota /ativos/codAtivo', async () => {
    req.params = {codAtivo: 1};
    const result = {
      status: 200,
      message: 'isso é uma mensagem',
    };

    sinon.stub(ativoService, 'getAssetsById').resolves(result);
    await ativoController.getAssetsById(req, res);
    ativoService.getAssetsById.restore();

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({message: 'isso é uma mensagem'})).to.be.true;
  });
});
