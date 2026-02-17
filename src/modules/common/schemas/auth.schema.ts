import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AuthType = 'http' | 'bearer' | 'jwt';

export class HeaderEntry {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  value: string;

  @Prop({ type: String })
  description?: string;
}

@Schema()
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

export const HeaderEntrySchema = SchemaFactory.createForClass(HeaderEntry);
export const AuthSchema = SchemaFactory.createForClass(Auth);
