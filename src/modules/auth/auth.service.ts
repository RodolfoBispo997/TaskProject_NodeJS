import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { SignInDTO, SignUpDTO } from "./auth.dto";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
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
}
