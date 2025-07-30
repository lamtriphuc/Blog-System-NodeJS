import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';
import { configureCloudinary } from './common/configs/cloudinary.config';
declare const module: any;
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  configureCloudinary();
  const app = await NestFactory.create(AppModule);
  // app.use(new LoggingMiddleware().use);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  })

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            [error.property]: error.constraints
              ? Object.values(error.constraints)[0]
              : 'Validation error',
          })),
        );
      },
    }),
  )
  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
