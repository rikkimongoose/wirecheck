import { Env } from '../../common/schemas/env.schema';
import * as Joi from 'joi';

export class UpdateProjectDto {
  name?: string;
  description?: string;
  envs?: Record<string, Env>;
}

export const UpdateProjectSchema = Joi.object({
  name: Joi.string().optional().min(1).max(100),
  description: Joi.string().optional().allow('').max(500),
  envs: Joi.object()
    .pattern(Joi.string(), Joi.object({
      url: Joi.string().required(),
      variables: Joi.object().pattern(Joi.string(), Joi.string()).optional()
    }))
    .optional(),
});