import { Auth } from '../../common/schemas/auth.schema';
import * as Joi from 'joi';
import { HeaderEntryDto } from './header-entry.dto';
import { RequestBodyType, RequestBody } from './request-body.dto';

/**
 * TypeScript-класс для частичного обновления теста
 */
export class UpdateTestDto {
  name?: string;
  description?: string;
  path?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  params?: Record<string, string>;
  headers?: HeaderEntryDto[];
  cookies?: HeaderEntryDto[];
  timeout?: number;
  auth?: Auth;
  body?: RequestBody;
  result?: {
    code?: number;
    headers?: HeaderEntryDto[];
    cookies?: HeaderEntryDto[];
    body?: any;
  };
  tests?: UpdateTestDto[];
  parentId?: string | null;
}

const HeaderEntrySchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.string().required(),
  description: Joi.string().optional(),
});

const MultipartFieldSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.string().optional(),
  fileName: Joi.string().optional(),
  contentType: Joi.string().optional(),
  description: Joi.string().optional(),
});

const RequestBodySchema = Joi.alternatives().try(
  Joi.object({
    type: Joi.string().valid(RequestBodyType.JSON).required(),
    description: Joi.string().optional(),
    value: Joi.any().required(),
  }),
  Joi.object({
    type: Joi.string().valid(RequestBodyType.FORM_URLENCODED).required(),
    description: Joi.string().optional(),
    fields: Joi.array().items(HeaderEntrySchema).required(),
  }),
  Joi.object({
    type: Joi.string().valid(RequestBodyType.MULTIPART).required(),
    description: Joi.string().optional(),
    fields: Joi.array().items(MultipartFieldSchema).required(),
  }),
  Joi.object({
    type: Joi.string().valid(RequestBodyType.RAW).required(),
    description: Joi.string().optional(),
    contentType: Joi.string().required(),
    value: Joi.string().required(),
  }),
  Joi.object({
    type: Joi.string().valid(RequestBodyType.BINARY).required(),
    description: Joi.string().optional(),
    fileName: Joi.string().optional(),
    contentType: Joi.string().optional(),
  }),
);

/**
 * Joi-схема для runtime-валидации
 */
export const UpdateTestSchema = Joi.object({
  name: Joi.string().optional().max(100),
  description: Joi.string().optional().allow('').max(500),
  path: Joi.string().optional(),
  method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS').optional(),
  params: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  headers: Joi.array().items(HeaderEntrySchema).optional(),
  cookies: Joi.array().items(HeaderEntrySchema).optional(),
  timeout: Joi.number().optional(),
  auth: Joi.object({
    type: Joi.string().valid('http', 'bearer', 'jwt').optional(),
    user: Joi.string().optional(),
    password: Joi.string().optional(),
    headers: Joi.array().items(HeaderEntrySchema).optional(),
  }).optional(),
  body: RequestBodySchema.optional(),
  result: Joi.object({
    code: Joi.number().optional(),
    headers: Joi.array().items(HeaderEntrySchema).optional(),
    cookies: Joi.array().items(HeaderEntrySchema).optional(),
    body: Joi.any().optional(),
  }).optional(),
  tests: Joi.array().items(Joi.link('#UpdateTestSchema')).optional(),
  parentId: Joi.string().optional().allow(null),
}).id('UpdateTestSchema');
