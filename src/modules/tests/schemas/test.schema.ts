import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

// Тип Auth
export type AuthType = 'http' | 'bearer' | 'jwt';

export class Auth {
  @Prop({ type: String })
  type?: AuthType;

  @Prop({ type: String })
  user?: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ type: Map, of: String })
  headers?: Record<string, string>;
}

// Результат теста
export class TestResult {
  @Prop()
  code?: number;

  @Prop({ type: Map, of: String })
  headers?: Record<string, string>;

  @Prop({ type: Map, of: String })
  cookies?: Record<string, string>;

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

  @Prop({ type: Map, of: String })
  headers?: Record<string, string>;

  @Prop({ type: Map, of: String })
  cookies?: Record<string, string>;

  @Prop({ default: 5000 })
  timeout?: number;

  @Prop({ type: Auth, default: {} })
  auth?: Auth;

  @Prop({ type: MongooseSchema.Types.Mixed })
  body?: any;

  @Prop()
  bodyType?: 'json' | 'form-data' | 'x-www-form-urlencoded' | 'text' | 'xml';

  @Prop({ type: TestResult, default: {} })
  result?: TestResult;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Test' }] })
  tests?: Test[]; // дочерние тесты
  
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId; // <-- добавили поле project
}

export const TestSchema = SchemaFactory.createForClass(Test);