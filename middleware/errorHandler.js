/**
     * adiciona a status a mensagem de erro.
 */
class HttpError extends Error {
  /**
   * @param {int} status Codigo de status http para retornar em caso de erro.
   * @param {str} message Mensagem de erro importada da classe super.
   */
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};

const errorHandler = (err, req, res, next) => {
  const {status, message} = err;
  if (!status) return res.status(500).json(message);
  return res.status(status).json({message});
};

module.exports = {
  errorHandler,
  HttpError,
};


