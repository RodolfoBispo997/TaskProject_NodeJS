import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDTO, SignUpDTO } from "./auth.dto";
import { AuthGuard } from "@nestjs/passport";
import type { User } from "../../generated/prisma";
import { AuthenticatedUser } from "../../common/decorators/authenticated-user.decorator";

@Controller({
  version: "1",
  path: "auth",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signUp(@Body() data: SignUpDTO) {
    return this.authService.signUp(data);
  }

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  signIn(@Body() data: SignInDTO) {
    return this.authService.signIn(data);
  }

  @Get("protected")
  @UseGuards(AuthGuard("jwt"))
  protected(@AuthenticatedUser() user: User) {
    return {
      message: `Authenticate ${user.email}`,
    };
  }
}
