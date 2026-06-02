import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
  ParseIntPipe, DefaultValuePipe,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@ApiTags('Posts')
@Controller()
export class PostsController {
  constructor(
      private readonly postsService: PostsService,
      private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('posts/feed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Feed: posts de gente que sigues' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getFeed(
      @CurrentUser() user: any,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getFeed(user.userId, page, limit);
  }

  @Get('posts/explore')
  @ApiOperation({ summary: 'Explorar: todos los posts' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getExplorePosts(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getAllPosts(page, limit);
  }

  @Get('users/me/posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mis posts + reposts' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getMyPosts(
      @CurrentUser() user: any,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getPostsByUser(user.userId, page, limit);
  }

  @Get('users/:userId/posts')
  @ApiOperation({ summary: 'Posts + reposts de un usuario' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getPostsByUser(
      @Param('userId') userId: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getPostsByUser(userId, page, limit);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { caption: { type: 'string' }, media: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('media', { storage: memoryStorage() }))
  async createPost(
      @CurrentUser() user: any,
      @Body() dto: CreatePostDto,
      @UploadedFile() file?: Express.Multer.File,
  ) {
    let mediaUrl: string | undefined;
    if (file) {
      mediaUrl = await this.cloudinaryService.uploadFile(file.buffer, 'posts');
    }
    return this.postsService.createPost(user.userId, dto, mediaUrl);
  }

  @Patch('posts/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updatePost(@CurrentUser() user: any, @Param('postId') postId: string, @Body() dto: UpdatePostDto) {
    return this.postsService.updatePost(user.userId, postId, dto);
  }

  @Delete('posts/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deletePost(@CurrentUser() user: any, @Param('postId') postId: string) {
    return this.postsService.deletePost(user.userId, postId);
  }

  @Post('posts/:postId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  likePost(@CurrentUser() user: any, @Param('postId') postId: string) {
    return this.postsService.likePost(user.userId, postId);
  }

  @Delete('posts/:postId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  unlikePost(@CurrentUser() user: any, @Param('postId') postId: string) {
    return this.postsService.unlikePost(user.userId, postId);
  }

  @Post('posts/:postId/repost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  repost(@CurrentUser() user: any, @Param('postId') postId: string) {
    return this.postsService.repost(user.userId, postId);
  }

  @Post('posts/:postId/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  savePost(@CurrentUser() user: any, @Param('postId') postId: string) {
    return this.postsService.savePost(user.userId, postId);
  }

  @Delete('posts/:postId/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  unsavePost(@CurrentUser() user: any, @Param('postId') postId: string) {
    return this.postsService.unsavePost(user.userId, postId);
  }

  @Get('users/me/saved')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getSaved(
      @CurrentUser() user: any,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postsService.getSavedPosts(user.userId, page, limit);
  }
}