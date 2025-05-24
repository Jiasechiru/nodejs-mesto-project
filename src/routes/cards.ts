import { Router } from 'express';
import { cardIdParamValidator, createCardValidator } from '../middlewares/requestValidators';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
} from '../controllers/cards';

const router = Router();
router.get('/', getCards);
router.post('/', createCardValidator, createCard);
router.delete('/:cardId', cardIdParamValidator, deleteCard);
router.put('/:cardId/likes', cardIdParamValidator, likeCard);
router.delete('/:cardId/likes', cardIdParamValidator, deleteLikeCard);

export default router;
