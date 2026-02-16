import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Env extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ type: Map, of: String })
  variables?: Record<string, string>;
}

export const EnvSchema = SchemaFactory.createForClass(Env);