import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Juan Pérez' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: 'Fotógrafo 📸 | Medellín' })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  bio?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatars/juan.jpg' })
  @IsString()
  @IsOptional()
  avatar?: string;
}

// Interfaz que describe la forma de un usuario en memoria / MongoDB
// Cuando agregues Mongoose, esto se convierte en un Schema
export interface IUser {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followersCount: number;
  followingCount: number;
  createdAt: Date;
}
