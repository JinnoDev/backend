import {
  Controller, Get, Post, Patch,
  Param, Body, Query, UseGuards,
  ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { CreateChatDto, SendMessageDto } from './dto/chats.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Messaging')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @ApiOperation({ summary: 'Mis chats' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getChats(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.chatsService.getChats(user.userId, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Iniciar un nuevo chat' })
  createChat(@CurrentUser() user: any, @Body() dto: CreateChatDto) {
    return this.chatsService.createChat(user.userId, dto);
  }

  @Get(':chatId/messages')
  @ApiOperation({ summary: 'Ver mensajes de un chat' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getMessages(
    @CurrentUser() user: any,
    @Param('chatId') chatId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
  ) {
    return this.chatsService.getMessages(user.userId, chatId, page, limit);
  }

  @Post(':chatId/messages')
  @ApiOperation({ summary: 'Enviar un mensaje' })
  sendMessage(
    @CurrentUser() user: any,
    @Param('chatId') chatId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatsService.sendMessage(user.userId, chatId, dto);
  }

  @Patch(':chatId/read')
  @ApiOperation({ summary: 'Marcar mensajes como leídos' })
  markAsRead(@CurrentUser() user: any, @Param('chatId') chatId: string) {
    return this.chatsService.markAsRead(user.userId, chatId);
  }
}
