import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador personalizado que extrae el usuario del JWT en el request.
 *
 * Uso en un controller:
 *   @Get('me')
 *   getMe(@CurrentUser() user: JwtPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Viene del JwtStrategy.validate()
  },
);
