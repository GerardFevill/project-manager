import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  const corsOrigins = configService.get('CORS_ORIGIN')?.split(',') || '*';
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation - Only in dev/test
  const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED');
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Jira Enterprise API')
      .setDescription('Complete Jira Enterprise REST API with 700 tables')
      .setVersion('1.0')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('projects', 'Project management')
      .addTag('issues', 'Issue tracking')
      .addTag('workflows', 'Workflow management')
      .addTag('boards', 'Agile boards')
      .addTag('sprints', 'Sprint management')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  // Start server
  const port = configService.get('PORT') || 3000;
  const env = configService.get('NODE_ENV') || 'development';
  await app.listen(port);

  console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║                                                       ║
    ║     🚀 Jira Enterprise API is running!               ║
    ║                                                       ║
    ║     🌍 Environment: ${env.padEnd(31)}║
    ║     📝 API: http://localhost:${port}/${apiPrefix}           ║
    ${swaggerEnabled ? `║     📚 Docs: http://localhost:${port}/api/docs            ║` : ''}
    ║     🗄️  Database: ${configService.get('DB_DATABASE')?.padEnd(29) || 'N/A'.padEnd(29)}║
    ║     📊 Tables: 700                                    ║
    ║                                                       ║
    ╚═══════════════════════════════════════════════════════╝
  `);
}

bootstrap();
