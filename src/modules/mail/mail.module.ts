import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import path from "node:path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import strict from "node:assert/strict";
import { ConfigModule, ConfigService } from "@nestjs/config";

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
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
