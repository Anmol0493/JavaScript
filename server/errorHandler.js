function errorHandler(res, statusCode, errorMessage) {
  return res.status(statusCode).send(errorMessage);
}

module.exports = errorHandler;