import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Test } from '../../tests/schemas/test.schema';
import { Env, EnvSchema } from '../../common/schemas/env.schema';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Map, of: EnvSchema })
  envs?: Record<string, Env>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Test' }] })
  tests?: Test[];

  @Prop()
  changedAt?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
