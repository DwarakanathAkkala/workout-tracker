import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Requirement: All routes must start with /api
  app.setGlobalPrefix('api'); 

  // Requirement: Validation must be enabled
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log("Server is running on http://localhost:3000/api");
}
bootstrap();