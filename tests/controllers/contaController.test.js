const {expect} = require('chai');
const sinon = require('sinon');


const contaService = require('../../services/contaServices');
const contaController = require('../../controllers/contaController');

describe('11 - testa o controller da rota /conta', async () => {
  const req = {};
  const res = {};

  before(() => {
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
  });

  it('testando a rota /conta/deposito', async () => {
    req.body = {
      codCliente: 1,
      valor: 1000,
    };
    const result = {
      status: 200,
      message: 'isso é uma mensagem',
    };

    sinon.stub(contaService, 'postDeposit').resolves(result);
    await contaController.postDeposit(req, res);
    contaService.postDeposit.restore();

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({message: 'isso é uma mensagem'})).to.be.true;
  });

  it('testando a rota /conta/saque', async () => {
    req.body = {
      codCliente: 1,
      valor: 1000,
    };
    const result = {
      status: 200,
      message: 'isso é uma mensagem',
    };

    sinon.stub(contaService, 'postWithdraw').resolves(result);
    await contaController.postWithdraw(req, res);
    contaService.postWithdraw.restore();

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({message: 'isso é uma mensagem'})).to.be.true;
  });

  it('testando a rota /conta/codCliente', async () => {
    req.params = {codCliente: 1};
    const result = {
      status: 200,
      message: 'isso é uma mensagem',
    };

    sinon.stub(contaService, 'getClientBalance').resolves(result);
    await contaController.getClientBalance(req, res);
    contaService.getClientBalance.restore();

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({message: 'isso é uma mensagem'})).to.be.true;
  });
});
