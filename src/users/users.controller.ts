import {
  Controller, Get, Patch, Post, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe, DefaultValuePipe,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/users.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService,
      private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@CurrentUser() user: any) {
    return this.usersService.getMe(user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMe(user.userId, dto);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar foto de perfil' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { avatar: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
  async updateAvatar(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    const avatarUrl = await this.cloudinaryService.uploadFile(file.buffer, 'avatars');
    return this.usersService.updateMe(user.userId, { avatar: avatarUrl });
  }

  @Get(':userId')
  @ApiParam({ name: 'userId' })
  getProfile(@Param('userId') userId: string) {
    return this.usersService.getPublicProfile(userId);
  }

  @Post(':userId/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  follow(@CurrentUser() user: any, @Param('userId') targetId: string) {
    return this.usersService.follow(user.userId, targetId);
  }

  @Delete(':userId/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  unfollow(@CurrentUser() user: any, @Param('userId') targetId: string) {
    return this.usersService.unfollow(user.userId, targetId);
  }

  @Get(':userId/followers')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getFollowers(
      @Param('userId') userId: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.usersService.getFollowers(userId, page, limit);
  }

  @Get(':userId/following')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getFollowing(
      @Param('userId') userId: string,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.usersService.getFollowing(userId, page, limit);
  }
}