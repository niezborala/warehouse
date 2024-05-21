import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './modules/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

export async function bootstrap(): Promise<any> {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        }),
    );

    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Warehouse API')
        .setDescription('Warehouse')
        .setVersion('v1')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/docs', app, document, { useGlobalPrefix: true });

    await app.listen(process.env.PORT);

    return app;
}