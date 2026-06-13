/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication):
    void {
        const config = new DocumentBuilder()
        .setTitle('Team Productivity Platform APIs')
        .setDescription('NestJS Backend APIs for Tasks, Categories, Tags, Notifications, Analytics, and Activity Logs')
        .setVersion('1.0.0')
            .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Paste FastAPI generated access token'
            },
            'access-token'
        )
        .build();

        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup('api/docs', app, document);
    }