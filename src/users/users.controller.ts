import {
  Controller, Get, Patch, Post, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe, DefaultValuePipe,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/users.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

function getAvatarsDir() {
  const base = process.env.UPLOADS_DIR ||
    (process.platform === 'win32'
      ? 'C:\\socialconnect-uploads'
      : join(process.env.HOME || '/tmp', 'socialconnect-uploads'));
  return join(base, 'avatars');
}

const avatarStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const dir = getAvatarsDir();
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  @UseInterceptors(FileInterceptor('avatar', { storage: avatarStorage }))
  updateAvatar(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    const port = process.env.PORT ?? 3000;
    const avatarUrl = `http://localhost:${port}/uploads/avatars/${file.filename}`;
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
