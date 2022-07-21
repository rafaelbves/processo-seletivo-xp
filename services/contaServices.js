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
const postDeposit = async (body) => {
  requestValidation(body);
  const {codCliente, valor} = body;

  const newDeposit = await model
      .countBalanceMovement(codCliente, valor, 'deposito');
  if (!newDeposit.insertId) {
    throw new HttpError(500, 'alguma coisa deu errada');
  };

  return {status: 201, message: 'deposito realisado'};
};

module.exports = {
  postDeposit,
};
