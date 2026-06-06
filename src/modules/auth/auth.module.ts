import { Inject, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../../prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { MailService } from "../mail/mail.service";
import { MailModule } from "../mail/mail.module";
import { RequestContextModule } from "../../common/services/request-context/request-context.module";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";

@Module({
  imports: [
    RequestContextModule,
    MailModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("SECRET_KEY"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    JwtStrategy,
    JwtAuthGuard,
    MailService,
    RequestContextModule,
  ],
})
export class AuthModule {}
