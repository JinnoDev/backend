import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Agrega createdAt y updatedAt automáticamente
export class User {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  username: string;

  @Prop({ required: true })
  password: string; // Guardado con bcrypt

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: 'https://i.pravatar.cc/150' })
  avatar: string;

  @Prop({ default: 0 })
  followersCount: number;

  @Prop({ default: 0 })
  followingCount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
