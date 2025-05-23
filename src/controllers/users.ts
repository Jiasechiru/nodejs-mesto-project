import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { ExtendedRequest } from '../middlewares/hardcodeauth';
import User from '../models/user';
import CustomError from '../errors/errors';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({}).then((users) => { res.send({ data: users }); })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw CustomError.NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

export const updateUser = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw CustomError.NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const updateAvatar = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw CustomError.NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};
