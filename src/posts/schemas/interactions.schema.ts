import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ── Like ──────────────────────────────────────────────────
export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

// ── Repost ────────────────────────────────────────────────
export type RepostDocument = Repost & Document;

@Schema({ timestamps: true })
export class Repost {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;
}

export const RepostSchema = SchemaFactory.createForClass(Repost);
RepostSchema.index({ userId: 1, postId: 1 }, { unique: true });

// ── Save ──────────────────────────────────────────────────
export type SaveDocument = Save & Document;

@Schema({ timestamps: true })
export class Save {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;
}

export const SaveSchema = SchemaFactory.createForClass(Save);
SaveSchema.index({ userId: 1, postId: 1 }, { unique: true });
