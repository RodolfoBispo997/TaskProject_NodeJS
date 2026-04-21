import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Versionamento
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //Swagger
  const config = new DocumentBuilder()
    .setTitle("Tasks API")
    .setDescription("API desenvolvida para consolidar conhecimentos")
    .setVersion("1")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
