import Joi from 'joi';
import { EnvSchema } from '../../common/schemas/env.schema';

export const CreateProjectSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().allow('').optional(),
  envs: Joi.object().pattern(Joi.string(), EnvSchema).required(),
});

export const UpdateProjectSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  description: Joi.string().allow('').optional(),
  envs: Joi.object().pattern(Joi.string(), EnvSchema).optional(),
});