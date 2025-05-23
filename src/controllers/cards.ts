import { NextFunction, Request, Response } from 'express';
import { ExtendedRequest } from '../middlewares/hardcodeauth';
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
    .then((card) => res.send({ data: card }))
    .catch(next);
};

export const deleteCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw CustomError.NotFound('Карточка не найдена');
    }
    Card.findByIdAndDelete(req.params.cardId)
      .then((deletedCard) => res.send({ data: deletedCard }))
      .catch(next);
  })
  .catch(() => { next(CustomError.BadRequest('Неверные данные карточки')); });

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
  .catch(() => { next(CustomError.BadRequest('Неверные данные карточки')); });

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
  .catch(() => { next(CustomError.BadRequest('Неверные данные карточки')); });
