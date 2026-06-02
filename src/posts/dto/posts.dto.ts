import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Mi primera publicación 🌅' })
  @IsString()
  @MaxLength(2200)
  caption: string;

  @IsOptional()
  media?: any;
}

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Caption actualizado ✏️' })
  @IsString()
  @IsOptional()
  @MaxLength(2200)
  caption?: string;
}

export enum PostFilter {
  FEED = 'feed',
  RECOMMENDED = 'recommended',
}

export class GetPostsQueryDto {
  @IsOptional()
  @IsEnum(PostFilter)
  filter?: PostFilter;
}

export interface IPost {
  id: string;
  authorId: string;
  caption: string;
  mediaUrl: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  createdAt: Date;
  updatedAt: Date;
}