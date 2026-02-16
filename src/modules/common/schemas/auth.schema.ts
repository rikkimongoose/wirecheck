import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthType = 'http' | 'bearer' | 'jwt';

@Schema()
export class Auth extends Document {
  @Prop({ type: String })
  type?: AuthType;

  @Prop({ type: String })
  user?: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ type: Map, of: String })
  headers?: Record<string, string>;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);