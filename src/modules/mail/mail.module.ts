import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import path from "node:path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { EMAIL_QUEUE, EMAIL_SERVICE } from "../../consts";
import { MailConsumer } from "./mail.consumer";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get("SMTP_HOST"),
          port: Number(config.get("SMTP_PORT")),
          secure: false,
          auth: {
            user: config.get("SMTP_USER"),
            pass: config.get("SMTP_PASS"),
          },
        },
        defaults: {
          from: '"Projeto de NestJS <no-reply@project.dev>"',
        },
        template: {
          dir: path.join(process.cwd(), "dist/modules/mail/templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    ClientsModule.registerAsync([
      {
        name: EMAIL_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const url = config.get<string>("RABBITMQ_URL");

          if (!url) {
            throw new Error("RABBITMQ_URL is not defined");
          }

          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: EMAIL_QUEUE,
              queueOptions: { durable: true },
            },
          };
        },
      },
    ]),
  ],
  providers: [MailService],
  exports: [MailService, ClientsModule],
  controllers: [MailConsumer],
})
export class MailModule {}
