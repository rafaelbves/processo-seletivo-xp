const {expect} = require('chai');
const sinon = require('sinon');

const contaService = require('../../services/contaServices');
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

describe('07 - faz a validação de pedido /conta/saque||deposito', async () => {
  it('cliente não informado', async () => {
    const wrongBody = {
      valor: 100.50,
    };
    try {
      await contaService.postDeposit(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor identificar o cliente');
    }
    try {
      await contaService.postWithdraw(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor identificar o cliente');
    }
  });

  it('valor do deposito/saque não informado', async () => {
    const wrongBody = {
      codCliente: 1,
    };
    try {
      await contaService.postDeposit(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor especificar o valor que deseja depositar');
    }
    try {
      await contaService.postWithdraw(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor especificar o valor que deseja depositar');
    };
  });

  it('valor do informado não pode ser negativo', async () => {
    const wrongBody = {
      codCliente: 1,
      valor: -100.50,
    };
    try {
      await contaService.postDeposit(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('valor tem que ser maior que zero');
    }
    try {
      await contaService.postWithdraw(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('valor tem que ser maior que zero');
    };
  });

  it('valor do informado não pode ser zero', async () => {
    const wrongBody = {
      codCliente: 1,
      valor: 0,
    };
    try {
      await contaService.postDeposit(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor especificar o valor que deseja depositar');
    }
    try {
      await contaService.postWithdraw(wrongBody);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('por favor especificar o valor que deseja depositar');
    };
  });
});

describe('08 - dapositar um valor na conta /conta/deposito', async () => {
  before(() => {
    sinon.stub(model, 'getClientsBalance').resolves(mockClientsBalance);
  });

  after(() => {
    model.getClientsBalance.restore();
  });

  it('cliente não existe', async () => {
    const deposit = {
      codCliente: 3,
      valor: 1000.00,
    };

    try {
      await contaService.postDeposit(deposit);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(404);
      expect(err).to.have.property('message')
          .to.equal('cliente não encontrado');
    }
  });

  it('erro ao atualizar o saldo do cliente', async () => {
    sinon.stub(model, 'countBalanceMovement').resolves({});

    const deposit = {
      codCliente: 1,
      valor: 1000.00,
    };

    try {
      await contaService.postDeposit(deposit);
    } catch (err) {
      model.countBalanceMovement.restore();
      expect(err).to.have.property('status').to.equal(500);
      expect(err).to.have.property('message')
          .to.equal('alguma coisa deu errado');
    };
  });

  it('deposito realisado com sucesso', async () => {
    sinon.stub(model, 'countBalanceMovement').resolves({insertId: 1});

    const deposit = {
      codCliente: 1,
      valor: 1000.00,
    };

    result = await contaService.postDeposit(deposit);

    model.countBalanceMovement.restore();

    expect(result).to.have.property('status').to.equal(201);
    expect(result).to.have.property('message')
        .to.equal('deposito realisado com sucesso');
  });
});

describe('09 - sacar um valor da conta', async () => {
  before(() => {
    sinon.stub(model, 'getClientsBalance').resolves(mockClientsBalance);
  });

  after(() => {
    model.getClientsBalance.restore();
  });

  it('cliente não existe', async () => {
    const withdraw = {
      codCliente: 3,
      valor: 1000.00,
    };

    try {
      await contaService.postWithdraw(withdraw);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(404);
      expect(err).to.have.property('message')
          .to.equal('cliente não encontrado');
    }
  });

  it('erro ao atualizar o saldo do cliente', async () => {
    sinon.stub(model, 'countBalanceMovement').resolves({});

    const withdraw = {
      codCliente: 1,
      valor: 1000.00,
    };

    try {
      await contaService.postWithdraw(withdraw);
    } catch (err) {
      model.countBalanceMovement.restore();
      expect(err).to.have.property('status').to.equal(500);
      expect(err).to.have.property('message')
          .to.equal('alguma coisa deu errado');
    };
  });

  it('valor que o cliente quer sacar é maior que o saldo', async () => {
    const withdraw = {
      codCliente: 2,
      valor: 1000.00,
    };
    try {
      await contaService.postWithdraw(withdraw);
    } catch (err) {
      expect(err).to.have.property('status').to.equal(400);
      expect(err).to.have.property('message')
          .to.equal('saldo insuficiente para esse saque');
    };
  });

  it('saque realisado com sucesso', async () => {
    sinon.stub(model, 'countBalanceMovement').resolves({insertId: 1});

    const withdraw = {
      codCliente: 1,
      valor: 1000.00,
    };

    result = await contaService.postWithdraw(withdraw);

    model.countBalanceMovement.restore();

    expect(result).to.have.property('status').to.equal(201);
    expect(result).to.have.property('message')
        .to.equal('saque realisado com sucesso');
  });
});
