import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';
import CustomError from '../errors/errors';

export interface ExtendedRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
  }
}

interface UserPayload extends JwtPayload {
  _id: mongoose.Types.ObjectId;
}

const { JWT_SECRET = 'aaab' } = process.env;

const authMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    throw CustomError.Unauthorized('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (err) {
    throw CustomError.Unauthorized('Необходима авторизация');
  }
  req.user = payload;
  next();
};

export default authMiddleware;
