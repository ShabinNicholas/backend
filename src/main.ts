import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Seed default admin account
  const authService = app.get(AuthService);
  await authService.seedAdmin();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Staff Management API running on http://localhost:${port}`);
}
bootstrap();
