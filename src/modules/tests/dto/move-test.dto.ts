import Joi from 'joi';

export const MoveTestSchema = Joi.object({
  newParentId: Joi.string().allow(null).required(),
});