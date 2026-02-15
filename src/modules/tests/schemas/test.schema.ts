import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Auth } from '../../modules/projects/schemas/project.schema';

export type TestDocument = TestEntity & Document;

@Schema({ timestamps: true })
export class TestEntity {
  @Prop({ required: true, index: true })
  projectId: string;

  @Prop({ index: true })
  parentId?: string;

  @Prop({ required: true, index: true })
  path: string; // materialized path

  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop()
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  @Prop()
  urlPath?: string;

  @Prop({ type: Object })
  params?: Record<string, string>;

  @Prop({ type: Object })
  headers?: Record<string, string>;

  @Prop()
  timeout?: number;

  @Prop({ type: Object })
  body?: any;

  @Prop()
  bodyType?: 'json' | 'form-data' | 'x-www-form-urlencoded' | 'text' | 'xml';

  @Prop({ type: Object })
  result?: {
    code: number;
    headers?: Record<string, string>;
    body?: any;
  };

  @Prop({ type: Object })
  auth?: Auth;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export const TestSchema = SchemaFactory.createForClass(TestEntity);
TestSchema.index({ projectId: 1, path: 1 });
TestSchema.index({ path: 1 });
