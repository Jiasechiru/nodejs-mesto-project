import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
  });
};

export default errorHandler;
