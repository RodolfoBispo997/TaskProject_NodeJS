import { MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable } from "@nestjs/common";
import { EMAIL_SERVICE, SEND_PASSWORD_RESET } from "../../consts";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class MailService {
  constructor(@Inject(EMAIL_SERVICE) private client: ClientProxy) {}

  async sendPasswordRequest(email: string, token: string) {
    const url = `http://localhost:3000/v1/auth/reset-password?token=${token}`;

    await this.client.connect();

    this.client.emit(SEND_PASSWORD_RESET, { email, url });
  }
}
