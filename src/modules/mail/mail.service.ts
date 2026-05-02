import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordRequest(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Redefinição de senha",
      template: "forgot-password",
      context: {
        url: `http:localhost:30000/v1/auth/reset-password?token=${token}`,
      },
    });
  }
}
