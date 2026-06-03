import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Like, LikeDocument, Repost, RepostDocument, Save, SaveDocument } from './schemas/interactions.schema';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { Follow } from '../users/schemas/follow.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Repost.name) private repostModel: Model<RepostDocument>,
    @InjectModel(Save.name) private saveModel: Model<SaveDocument>,
    @InjectModel(Follow.name) private followModel: Model<any>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // Feed: posts from people the user follows
  async getFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const following = await this.followModel.find({ followerId: userId }).select('followingId');
    const followingIds = following.map((f: any) => f.followingId);
    const filter = { authorId: { $in: followingIds, $ne: null, $exists: true } };
    const [raw, total] = await Promise.all([
      this.postModel.find(filter).populate('authorId', 'username avatar name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.postModel.countDocuments(filter),
    ]);
    const data = raw.filter((p: any) => p.authorId && typeof p.authorId === 'object');
    return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  // Explore: all posts
  async getAllPosts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const filter = { authorId: { $ne: null, $exists: true } };
    const [raw, total] = await Promise.all([
      this.postModel.find(filter).populate('authorId', 'username avatar name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.postModel.countDocuments(filter),
    ]);
    const data = raw.filter(p => p.authorId && typeof p.authorId === 'object');
    return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  async getPostsByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Own posts
    const ownPosts = await this.postModel
      .find({ authorId: userId })
      .populate('authorId', 'username avatar name')
      .sort({ createdAt: -1 })
      .lean();

    // Reposted posts
    const reposts = await this.repostModel.find({ userId }).select('postId createdAt').lean();
    const repostPostIds = reposts.map((r: any) => r.postId);
    const repostedPosts = await this.postModel
      .find({ _id: { $in: repostPostIds } })
      .populate('authorId', 'username avatar name')
      .lean();

    // Mark reposts and merge
    const repostedWithMeta = repostedPosts.map((p: any) => ({
      ...p,
      isRepost: true,
      repostedByUserId: userId,
    }));

    // Combine: own posts + reposts, sort by date, deduplicate
    const ownIds = new Set(ownPosts.map((p: any) => p._id.toString()));
    const uniqueReposts = repostedWithMeta.filter((p: any) => !ownIds.has(p._id.toString()));
    const all = [...ownPosts, ...uniqueReposts].sort((a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = all.length;
    const data = all.slice(skip, skip + limit);
    return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
  }
  async createPost(userId: string, dto: CreatePostDto, mediaUrl?: string) {
    const post = await this.postModel.create({
      authorId: userId,
      caption: dto.caption,
      mediaUrl: mediaUrl ?? '',
    });
    return this.postModel.findById(post._id).populate('authorId', 'username avatar name');
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.findOrThrow(postId);
    if (post.authorId.toString() !== userId) throw new ForbiddenException('No es tu post');
    return this.postModel.findByIdAndUpdate(postId, dto, { new: true });
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.findOrThrow(postId);
    if (post.authorId.toString() !== userId) throw new ForbiddenException('No es tu post');
    await this.postModel.findByIdAndDelete(postId);
    return { success: true };
  }

  async likePost(userId: string, postId: string) {
    const post = await this.findOrThrow(postId);
    try { await this.likeModel.create({ userId, postId }); }
    catch { throw new ConflictException('Ya diste like'); }
    const updated = await this.postModel.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } }, { new: true });
    const ownerId = post.authorId.toString();
    if (ownerId !== userId) {
      await this.notificationsService.create({ userId: ownerId, actorId: userId, type: 'like', postId, message: 'le dio like a tu publicación' });
    }
    return { success: true, likesCount: updated?.likesCount };
  }

  async unlikePost(userId: string, postId: string) {
    const post = await this.findOrThrow(postId);
    const result = await this.likeModel.findOneAndDelete({ userId, postId });
    if (!result) throw new NotFoundException('No habías dado like');
    const updated = await this.postModel.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } }, { new: true });
    // Remove notification when unlike
    const ownerId = post.authorId.toString();
    if (ownerId !== userId) {
      await this.notificationsService.remove({ userId: ownerId, actorId: userId, type: 'like', postId });
    }
    return { success: true, likesCount: updated?.likesCount };
  }

  async repost(userId: string, postId: string) {
    const post = await this.findOrThrow(postId);
    const existing = await this.repostModel.findOne({ userId, postId });
    if (existing) {
      await this.repostModel.deleteOne({ userId, postId });
      const updated = await this.postModel.findByIdAndUpdate(postId, { $inc: { repostsCount: -1 } }, { new: true });
      // Remove notification when unrepost
      const ownerId = post.authorId.toString();
      if (ownerId !== userId) {
        await this.notificationsService.remove({ userId: ownerId, actorId: userId, type: 'repost', postId });
      }
      return { success: true, reposted: false, repostsCount: updated?.repostsCount };
    }
    await this.repostModel.create({ userId, postId });
    const updated = await this.postModel.findByIdAndUpdate(postId, { $inc: { repostsCount: 1 } }, { new: true });
    const ownerId = post.authorId.toString();
    if (ownerId !== userId) {
      await this.notificationsService.create({ userId: ownerId, actorId: userId, type: 'repost', postId, message: 'reposteó tu publicación' });
    }
    return { success: true, reposted: true, repostsCount: updated?.repostsCount };
  }

  async savePost(userId: string, postId: string) {
    await this.findOrThrow(postId);
    try { await this.saveModel.create({ userId, postId }); }
    catch { throw new ConflictException('Ya guardaste este post'); }
    return { success: true };
  }

  async unsavePost(userId: string, postId: string) {
    await this.findOrThrow(postId);
    const result = await this.saveModel.findOneAndDelete({ userId, postId });
    if (!result) throw new NotFoundException('No habías guardado este post');
    return { success: true };
  }

  async getSavedPosts(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const saves = await this.saveModel.find({ userId }).skip(skip).limit(limit);
    const postIds = saves.map((s: any) => s.postId);
    const data = await this.postModel.find({ _id: { $in: postIds } }).populate('authorId', 'username avatar');
    const total = await this.saveModel.countDocuments({ userId });
    return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  async incrementCommentCount(postId: string, delta: 1 | -1) {
    await this.postModel.findByIdAndUpdate(postId, { $inc: { commentsCount: delta } });
  }

  async findOrThrow(postId: string): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post no encontrado');
    return post;
  }
}
