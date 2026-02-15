import Joi from 'joi';

// Схема для валидации обновления проекта
export const UpdateProjectSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  envs: Joi.object()
    .pattern(Joi.string(), Joi.string())
    .optional(),
});