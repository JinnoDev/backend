import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actorId: Types.ObjectId;

  @Prop({ enum: ['like', 'comment', 'follow', 'repost', 'mention'], required: true })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  postId?: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  createdAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Unique index prevents duplicates at DB level
NotificationSchema.index(
  { userId: 1, actorId: 1, type: 1, postId: 1 },
  { unique: true, sparse: true }
);
NotificationSchema.index({ userId: 1, createdAt: -1 });
