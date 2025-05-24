import { NextFunction, Request, Response } from 'express';
import { ExtendedRequest } from '../middlewares/auth';
import Card from '../models/card';
import CustomError from '../errors/errors';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({}).then((cards) => {
    res.send({ data: cards });
  })
    .catch(next);
};

export const createCard = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(CustomError.BadRequest(err.message));
      } else {
        next();
      }
    });
};

export const deleteCard = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw CustomError.NotFound('Карточка не найдена');
    }
    if (card.owner.toString() !== req.user?._id.toString()) {
      throw CustomError.Forbidden('Вы не можете удалить карточку другого пользователя');
    }
    Card.findByIdAndDelete(req.params.cardId)
      .then((deletedCard) => res.send({ data: deletedCard }))
      .catch(next);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(CustomError.BadRequest('Неверные данные карточки'));
    } else {
      next();
    }
  });

export const likeCard = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw CustomError.NotFound('Карточка не найдена');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(CustomError.BadRequest('Неверные данные карточки'));
    } else {
      next();
    }
  });

export const deleteLikeCard = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw CustomError.NotFound('Карточка не найдена');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(CustomError.BadRequest('Неверные данные карточки'));
    } else {
      next();
    }
  });
