import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que protege rutas con JWT.
 * Uso: @UseGuards(JwtAuthGuard) sobre el controller o el método.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
