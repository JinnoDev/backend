import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';

// Upload dir outside of project — survives reinstalls/restarts
// Windows: C:\socialconnect-uploads   Linux/Mac: ~/socialconnect-uploads
const UPLOADS_DIR = process.env.UPLOADS_DIR ||
  (process.platform === 'win32'
    ? 'C:\\socialconnect-uploads'
    : join(process.env.HOME || '/tmp', 'socialconnect-uploads'));

// Create subdirs if they don't exist
['posts', 'avatars'].forEach(sub => {
  const p = join(UPLOADS_DIR, sub);
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
});

// Export so controllers can use it
export { UPLOADS_DIR };

async function bootstrap() {
  console.log('MONGODB_URI =', process.env.MONGODB_URI);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');

  // Serve uploaded files from persistent directory
  app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads' });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle('SocialConnect API')
    .setDescription('API REST tipo Instagram')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n✅ Corriendo: http://localhost:${port}/docs`);
  console.log(`📁 Imágenes guardadas en: ${UPLOADS_DIR}\n`);
  console.log('MONGODB_URI =', process.env.MONGODB_URI);
}

bootstrap();
