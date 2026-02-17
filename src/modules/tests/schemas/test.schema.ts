import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import {
  Auth,
  AuthSchema,
  HeaderEntry,
  HeaderEntrySchema,
} from '../../common/schemas/auth.schema';

export enum RequestBodyType {
  JSON = 'json',
  FORM_URLENCODED = 'form-urlencoded',
  MULTIPART = 'multipart',
  RAW = 'raw',
  BINARY = 'binary',
}

export interface BaseRequestBody {
  type: RequestBodyType;
  description?: string;
}

export interface JsonRequestBody extends BaseRequestBody {
  type: RequestBodyType.JSON;
  value: unknown;
}

export interface FormUrlEncodedRequestBody extends BaseRequestBody {
  type: RequestBodyType.FORM_URLENCODED;
  fields: HeaderEntry[];
}

export interface MultipartField {
  name: string;
  value?: string;
  fileName?: string;
  contentType?: string;
  description?: string;
}

export interface MultipartRequestBody extends BaseRequestBody {
  type: RequestBodyType.MULTIPART;
  fields: MultipartField[];
}

export interface RawRequestBody extends BaseRequestBody {
  type: RequestBodyType.RAW;
  contentType: string;
  value: string;
}

export interface BinaryRequestBody extends BaseRequestBody {
  type: RequestBodyType.BINARY;
  fileName?: string;
  contentType?: string;
}

export type RequestBody =
  | JsonRequestBody
  | FormUrlEncodedRequestBody
  | MultipartRequestBody
  | RawRequestBody
  | BinaryRequestBody;

// Результат теста
export class TestResult {
  @Prop()
  code?: number;

  @Prop({ type: [HeaderEntrySchema], default: [] })
  headers?: HeaderEntry[];

  @Prop({ type: [HeaderEntrySchema], default: [] })
  cookies?: HeaderEntry[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  body?: any;
}

@Schema({ timestamps: true })
export class Test extends Document {
  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop()
  path: string;

  @Prop({ default: 'GET' })
  method: string;

  @Prop({ type: Map, of: String })
  params?: Record<string, string>;

  @Prop({ type: [HeaderEntrySchema], default: [] })
  headers?: HeaderEntry[];

  @Prop({ type: [HeaderEntrySchema], default: [] })
  cookies?: HeaderEntry[];

  @Prop({ default: 5000 })
  timeout?: number;

  @Prop({ type: AuthSchema, default: {} })
  auth?: Auth;

  @Prop({ type: MongooseSchema.Types.Mixed })
  body?: RequestBody;

  @Prop({ type: TestResult, default: {} })
  result?: TestResult;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Test' }] })
  tests?: Test[]; // дочерние тесты

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId; // <-- добавили поле project
}

export const TestSchema = SchemaFactory.createForClass(Test);
