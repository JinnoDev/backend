import { IsArray, IsString, IsEnum, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ example: ['user_001', 'user_002'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  participants: string[];
}

export class SendMessageDto {
  @ApiProperty({ example: 'Hola, ¿cómo estás? 👋' })
  @IsString()
  content: string;

  @ApiProperty({ enum: ['text', 'image', 'video', 'audio'], default: 'text' })
  @IsEnum(['text', 'image', 'video', 'audio'])
  type: 'text' | 'image' | 'video' | 'audio' = 'text';
}

export interface IChat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
}

export interface IMessage {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'image' | 'video' | 'audio';
  content: string;
  readBy: string[];
  createdAt: Date;
}
