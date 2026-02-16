import { Auth } from '../../common/schemas/auth.schema';
import * as Joi from 'joi';

/**
 * TypeScript-класс для частичного обновления теста
 */
export class UpdateTestDto {
  name?: string;
  description?: string;
  path?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string>;
  headers?: Record<string, string>;
  timeout?: number;
  auth?: Auth;
  body?: any;
  bodyType?: 'json' | 'form-data' | 'x-www-form-urlencoded' | 'text' | 'xml';
  result?: {
    code?: number;
    headers?: Record<string, string>;
    body?: any;
  };
  tests?: UpdateTestDto[];
  parentId?: string | null;
}

/**
 * Joi-схема для runtime-валидации
 */
export const UpdateTestSchema = Joi.object({
  name: Joi.string().optional().max(100),
  description: Joi.string().optional().allow('').max(500),
  path: Joi.string().optional(),
  method: Joi.string().valid('GET','POST','PUT','DELETE','PATCH').optional(),
  params: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  timeout: Joi.number().optional(),
  auth: Joi.object({
    type: Joi.string().valid('http','bearer','jwt').optional(),
    user: Joi.string().optional(),
    password: Joi.string().optional(),
    headers: Joi.object().pattern(Joi.string(), Joi.string()).optional()
  }).optional(),
  body: Joi.any().optional(),
  bodyType: Joi.string().valid('json','form-data','x-www-form-urlencoded','text','xml').optional(),
  result: Joi.object({
    code: Joi.number().optional(),
    headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    body: Joi.any().optional()
  }).optional(),
  tests: Joi.array().items(Joi.link('#UpdateTestSchema')).optional(),
  parentId: Joi.string().optional().allow(null)
}).id('UpdateTestSchema');