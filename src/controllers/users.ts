import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ExtendedRequest } from '../middlewares/auth';
import User from '../models/user';
import CustomError from '../errors/errors';

const { JWT_SECRET = 'aaab' } = process.env;

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
      const userObject = user.toObject();
      const { password, ...userWithoutPassword } = userObject;
      res.status(201).send({ data: userWithoutPassword });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(CustomError.BadRequest(err.message));
      } else if (err.message.includes('E11000')) {
        next(CustomError.Conflict('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw CustomError.NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(CustomError.BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

export const updateAvatar = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw CustomError.NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(CustomError.BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw CustomError.Unauthorized('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw CustomError.Unauthorized('Неправильные почта или пароль');
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true });
      res.send({ message: 'OK' });
    })
    .catch(next);
};

export const getCurrentUser = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (!user) {
        throw CustomError.NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};
