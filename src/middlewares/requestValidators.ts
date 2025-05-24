import { celebrate, Joi, Segments } from 'celebrate';

export const loginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const regValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const updateUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
});

export const updateAvatarValidator = celebrate({
  [Segments.BODY]: {
    avatar: Joi.string().uri(),
  },
});

export const idParamValidator = celebrate({
  [Segments.PARAMS]: {
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  },
});

export const cardIdParamValidator = celebrate({
  [Segments.PARAMS]: {
    cardId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  },
});

export const createCardValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
});
