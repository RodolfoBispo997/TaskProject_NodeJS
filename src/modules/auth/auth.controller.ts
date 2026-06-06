import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from "./auth.dto";
import { AuthGuard } from "@nestjs/passport";
import type { User } from "../../generated/prisma";
import { AuthenticatedUser } from "../../common/decorators/authenticated-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";

@Controller({
  version: "1",
  path: "auth",
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post("signup")
  signUp(@Body() data: SignUpDTO) {
    return this.authService.signUp(data);
  }

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  signIn(@Body() data: SignInDTO) {
    return this.authService.signIn(data);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("jwt")
  async me(@AuthenticatedUser() user: User) {
    const userData = await this.userService.findById(user.id);

    if (!userData) {
      throw new UnauthorizedException("User not found");
    }

    return {
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      email: userData.email,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() data: ForgotPasswordDTO) {
    return this.authService.forgotPassword(data.email);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() data: ResetPasswordDTO) {
    return this.authService.resetPassword(data.token, data.newPassword);
  }
}
