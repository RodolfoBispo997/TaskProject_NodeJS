import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { SignInDTO, SignUpDTO } from "./auth.dto";
import bcrypt from "bcrypt";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async signUp(data: SignUpDTO) {
    const hash = await bcrypt.hash(data.password, 12);

    const newUser = await this.usersService.create({
      ...data,
      password: hash,
    });

    return {
      token: this.jwtService.sign({
        sub: newUser.id,
      }),
    };
  }

  async signIn(data: SignInDTO) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (isValidPassword) {
      return {
        token: this.jwtService.sign({
          sub: user.id,
        }),
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      purpose: "password_reset",
    });

    await this.mailService.sendPasswordRequest(user.email, token);

    return {
      message: "Password request email sent",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.purpose !== "password_reset") {
        throw new BadRequestException("Invalid token");
      }

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new BadRequestException("Invalid token");
      }

      const hash = await bcrypt.hash(newPassword, 12);

      return this.prisma.user.update({
        where: { id: user.id },
        data: { password: hash },
      });
    } catch (error) {
      console.log("==.>>>>>", error);
      throw new BadRequestException("Invalid or expired token");
    }
  }
}
