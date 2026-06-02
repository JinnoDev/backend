import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/comments.dto';
import { PostsService } from '../posts/posts.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly postsService: PostsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getComments(postId: string, page: number, limit: number) {
    await this.postsService.findOrThrow(postId);
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.commentModel.find({ postId }).populate('authorId', 'username avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.commentModel.countDocuments({ postId }),
    ]);
    return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  async createComment(userId: string, postId: string, dto: CreateCommentDto) {
    const post = await this.postsService.findOrThrow(postId);
    const created = await this.commentModel.create({ postId, authorId: userId, text: dto.text });
    await this.postsService.incrementCommentCount(postId, 1);
    const comment = await this.commentModel.findById(created._id).populate('authorId', 'username avatar');

    // Notify post owner
    const ownerId = post.authorId.toString();
    if (ownerId !== userId) {
      await this.notificationsService.create({
        userId: ownerId,
        actorId: userId,
        type: 'comment',
        postId,
        message: `comentó en tu publicación: "${dto.text.slice(0, 50)}"`,
      });
    }
    return comment || created;
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comentario no encontrado');
    if (comment.authorId.toString() !== userId) throw new ForbiddenException('No puedes eliminar este comentario');
    await this.commentModel.findByIdAndDelete(commentId);
    await this.postsService.incrementCommentCount(comment.postId.toString(), -1);
    return { success: true };
  }
}
