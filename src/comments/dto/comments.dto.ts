import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: '¡Qué foto tan bonita! 😍' })
  @IsString()
  @MaxLength(500)
  text: string;
}

export interface IComment {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  createdAt: Date;
}
