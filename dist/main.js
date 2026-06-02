"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOADS_DIR = void 0;
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const fs_1 = require("fs");
const app_module_1 = require("./app.module");
const UPLOADS_DIR = process.env.UPLOADS_DIR ||
    (process.platform === 'win32'
        ? 'C:\\socialconnect-uploads'
        : (0, path_1.join)(process.env.HOME || '/tmp', 'socialconnect-uploads'));
exports.UPLOADS_DIR = UPLOADS_DIR;
['posts', 'avatars'].forEach(sub => {
    const p = (0, path_1.join)(UPLOADS_DIR, sub);
    if (!(0, fs_1.existsSync)(p))
        (0, fs_1.mkdirSync)(p, { recursive: true });
});
async function bootstrap() {
    console.log('MONGODB_URI =', process.env.MONGODB_URI);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads' });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({ origin: '*' });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SocialConnect API')
        .setDescription('API REST tipo Instagram')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    swagger_1.SwaggerModule.setup('docs', app, swagger_1.SwaggerModule.createDocument(app, config));
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`\n✅ Corriendo: http://localhost:${port}/docs`);
    console.log(`📁 Imágenes guardadas en: ${UPLOADS_DIR}\n`);
    console.log('MONGODB_URI =', process.env.MONGODB_URI);
}
bootstrap();
//# sourceMappingURL=main.js.map