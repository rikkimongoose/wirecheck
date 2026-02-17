import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

// Тип Auth
export type AuthType = 'http' | 'bearer' | 'jwt';

export class HeaderEntry {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  value: string;

  @Prop({ type: String })
  description?: string;
}

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

export class Auth {
  @Prop({ type: String })
  type?: AuthType;

  @Prop({ type: String })
  user?: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ type: [HeaderEntry], default: [] })
  headers?: HeaderEntry[];
}

// Результат теста
export class TestResult {
  @Prop()
  code?: number;

  @Prop({ type: [HeaderEntry], default: [] })
  headers?: HeaderEntry[];

  @Prop({ type: [HeaderEntry], default: [] })
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

  @Prop({ type: [HeaderEntry], default: [] })
  headers?: HeaderEntry[];

  @Prop({ type: [HeaderEntry], default: [] })
  cookies?: HeaderEntry[];

  @Prop({ default: 5000 })
  timeout?: number;

  @Prop({ type: Auth, default: {} })
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
