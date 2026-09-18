import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable global DTO Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configure Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Slot 5: NestJS & Prisma REST API')
    .setDescription('Tài liệu API hướng dẫn kết nối PostgreSQL và Prisma với NestJS')
    .setVersion('1.0')
    .addTag('Users', 'Quản lý người dùng')
    .addTag('Posts', 'Quản lý bài viết')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 NestJS Backend is running on: http://localhost:${port}`);
  console.log(`📑 Swagger Documentation available at: http://localhost:${port}/api`);
}
bootstrap();
