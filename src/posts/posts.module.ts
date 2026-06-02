import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/post.schema';
import { Like, LikeSchema, Repost, RepostSchema, Save, SaveSchema } from './schemas/interactions.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { Follow, FollowSchema } from '../users/schemas/follow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Repost.name, schema: RepostSchema },
      { name: Save.name, schema: SaveSchema },
      { name: Follow.name, schema: FollowSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, MongooseModule],
})
export class PostsModule {}
