import { Auth } from '../../common/schemas/auth.schema';
import * as Joi from 'joi';

/**
 * TypeScript-класс для Type Checking
 */
export class CreateTestDto {
  /** Имя теста (опционально) */
  name?: string;

  /** Описание теста */
  description?: string;

  /** Путь запроса */
  path: string;

  /** HTTP метод */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

  /** Параметры URL */
  params?: Record<string, string>;

  /** Заголовки HTTP */
  headers?: Record<string, string>;

  /** Cookies HTTP */
  cookies?: Record<string, string>;

  /** Таймаут запроса */
  timeout?: number;

  /** Аутентификация */
  auth?: Auth;

  /** Тело запроса */
  body?: any;

  /** Тип тела запроса */
  bodyType?: 'json' | 'form-data' | 'x-www-form-urlencoded' | 'text' | 'xml';

  /** Ожидаемый результат */
  result?: {
    code?: number;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
    body?: any;
  };

  /** Дочерние тесты (рекурсивно) */
  tests?: CreateTestDto[];

  /** Опциональный ID родителя (для вставки в дерево) */
  parentId?: string;

  /** ID проекта */
  projectId: string;
}

/**
 * Joi-схема для runtime-валидации
 */
export const CreateTestSchema = Joi.object({
  name: Joi.string().optional().max(100),
  description: Joi.string().optional().allow('').max(500),
  path: Joi.string().required(),
  method: Joi.string().valid('GET','POST','PUT','DELETE','PATCH','HEAD','OPTIONS').optional(),
  params: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  cookies: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  timeout: Joi.number().optional(),
  auth: Joi.object({
    type: Joi.string().valid('http','bearer','jwt').optional(),
    user: Joi.string().optional(),
    password: Joi.string().optional(),
    headers: Joi.object().pattern(Joi.string(), Joi.string()).optional()
  }).optional(),
  body: Joi.string().optional(),
  bodyType: Joi.string().valid('json','form-data','x-www-form-urlencoded','text','xml').optional(),
  result: Joi.object({
    code: Joi.number().optional(),
    headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    cookies: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    body: Joi.any().optional()
  }).optional(),
  tests: Joi.array().items(Joi.link('#CreateTestSchema')).optional(),
  parentId: Joi.string().optional().allow(null),
  projectId: Joi.string().required()
}).id('CreateTestSchema');