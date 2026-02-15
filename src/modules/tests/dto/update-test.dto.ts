import Joi from 'joi';
import { AuthSchema } from '../../common/schemas/auth.schema';

// Валидация обновления теста — все поля опциональные
export const UpdateTestSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  method: Joi.string().valid('GET','POST','PUT','PATCH','DELETE').optional(),
  urlPath: Joi.string().optional(),
  params: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  timeout: Joi.number().min(1).max(60000).optional(),
  auth: AuthSchema.optional(),
  bodyType: Joi.string().valid('json','form-data','x-www-form-urlencoded','text','xml').optional(),
  body: Joi.any().optional(),
  result: Joi.object({
    code: Joi.number().min(100).max(599).optional(),
    headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    body: Joi.any().optional(),
  }).optional(),
});