import { Env } from '../../common/schemas/env.schema';
import * as Joi from 'joi';

// TypeScript-класс для Type Checking
export class CreateProjectDto {
  name: string;
  description?: string;
  envs?: Record<string, Env>;
}

// Joi-схема для runtime-валидации
export const CreateProjectSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  description: Joi.string().optional().allow('').max(500),
  envs: Joi.object()
    .pattern(Joi.string(), Joi.object({
      url: Joi.string().required(),
      variables: Joi.object().pattern(Joi.string(), Joi.string()).optional()
    }))
    .optional(),
});