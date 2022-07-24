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
  if (!client) throw new HttpError(404, 'cliente não encontrado');

  const {saldo} = client;
  if (saldo <= saque) {
    throw new HttpError(
        400,
        'saldo insuficiente para esse saque',
    );
  };
};

const executeDeposit = async (body) => {
  const {codCliente, valor} = body;

  const newTransaction = {
    codCliente,
    valor: valor.toFixed(2),
    transactionType: 'deposito',
  };

  const allClientsBalance = await model.getClientsBalance();

  const searchedClient = allClientsBalance
      .find((client) => client.codCliente === codCliente);

  if (!searchedClient) throw new HttpError(404, 'cliente não encontrado');

  const newDeposit = await model
      .countBalanceMovement(newTransaction);

  if (!newDeposit.insertId) {
    throw new HttpError(500, 'alguma coisa deu errado');
  };
};

const executeWithdraw = async (body) => {
  const {codCliente, valor} = body;

  const newTransaction = {
    codCliente,
    valor: (valor * -1).toFixed(2),
    transactionType: 'saque',
  };

  const newWithdraw = await model
      .countBalanceMovement(newTransaction);

  if (!newWithdraw.insertId) {
    throw new HttpError(500, 'alguma coisa deu errado');
  };
};

const postDeposit = async (body) => {
  requestValidation(body);

  await executeDeposit(body);

  return {status: 201, message: 'deposito realisado com sucesso'};
};

const postWithdraw = async (body) => {
  requestValidation(body);
  const {codCliente, valor} = body;

  const allClientsBalance = await model.getClientsBalance();
  const searchedClient = allClientsBalance
      .find((client) => client.codCliente === codCliente);

  balanceCheck(searchedClient, valor);

  await executeWithdraw(body);

  return {status: 201, message: 'saque realisado com sucesso'};
};

const getClientBalance = async (codCliente) => {
  const allClients = await model.getClientsBalance();
  const searchedClient = allClients
      .find((client) => client.codCliente === parseInt(codCliente));
  if (!searchedClient) {
    throw new HttpError(404, 'cliente não encontrado');
  };
  return {status: 200, message: searchedClient};
};

module.exports = {
  postDeposit,
  postWithdraw,
  getClientBalance,
};
