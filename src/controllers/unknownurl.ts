import { NextFunction, Request, Response } from 'express';
import CustomError from '../errors/errors';

const unknownUrl = (req: Request, res: Response, next: NextFunction) => {
  next(CustomError.NotFound('Маршрут не найден'));
};

export default unknownUrl;
