const model = require('../models/models');
const {HttpError} = require('../middleware/errorHandler');

const requestValidation = (body) => {
  const {codCliente, valor} = body;
  if (!codCliente) {
    throw new HttpError(400, 'por favor identificar o cliente');
  };
  if (!valor) {
    throw new HttpError(
        400,
        'por favor especificar o valor que deseja depositar',
    );
  };
  if (valor <= 0) {
    throw new HttpError(
        400,
        'valor tem que ser maior que zero',
    );
  };
};

const balanceCheck = (client, saque) => {
  const {saldo} = client;

  if (saldo <= saque) {
    throw new HttpError(
        400,
        'saldo insuficiente para esse saque',
    );
  };
};

const postDeposit = async (body) => {
  requestValidation(body);
  const {codCliente, valor} = body;

  const newTransaction = {
    codCliente,
    valor: valor.toFixed(2),
    transactionType: 'deposito',
  };

  const newDeposit = await model
      .countBalanceMovement(newTransaction);
  if (!newDeposit.insertId) {
    throw new HttpError(500, 'alguma coisa deu errada');
  };

  return {status: 201, message: 'deposito realisado'};
};

const postWithdraw = async (body) => {
  requestValidation(body);
  const {codCliente, valor} = body;

  const allClientsBalance = await model.getClientsBalance();
  const searchedClient = allClientsBalance
      .find((client) => client.codCliente === codCliente);

  balanceCheck(searchedClient, valor);

  const newTransaction = {
    codCliente,
    valor: (valor * -1).toFixed(2),
    transactionType: 'saque',
  };

  const newWithdraw = await model
      .countBalanceMovement(newTransaction);

  if (!newWithdraw.insertId) {
    throw new HttpError(500, 'alguma coisa deu errada');
  };

  return {status: 201, message: 'saque realisado com sucesso'};
};

module.exports = {
  postDeposit,
  postWithdraw,
};
