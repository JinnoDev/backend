import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async search(query: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const regex = new RegExp(query, 'i'); // Búsqueda insensible a mayúsculas

    const [users, posts] = await Promise.all([
      this.userModel.find({
        $or: [{ username: regex }, { name: regex }],
      }).select('-password -email').limit(limit),
      this.postModel.find({ caption: regex }).limit(limit),
    ]);

    const allResults = [
      ...users.map((u) => ({ type: 'user', ...u.toObject() })),
      ...posts.map((p) => ({ type: 'post', ...p.toObject() })),
    ];

    return {
      query,
      data: allResults.slice(skip, skip + limit),
      page, limit,
      total: allResults.length,
    };
  }
}
