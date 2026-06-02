import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ required: true, maxlength: 2200 })
  caption: string;

  @Prop({ default: '' })
  mediaUrl: string;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  commentsCount: number;

  @Prop({ default: 0 })
  repostsCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Índice de texto para búsqueda por caption
PostSchema.index({ caption: 'text' });
