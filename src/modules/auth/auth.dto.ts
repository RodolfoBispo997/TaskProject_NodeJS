import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Role } from "../../generated/prisma";

export class SignUpDTO {
  @ApiProperty({ description: "User name" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: "User email", uniqueItems: true })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: "User password", minLength: 6 })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    description: "User role",
    enum: Role,
    default: Role.ADMIN,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.ADMIN;
}

export class SignInDTO {
  @ApiProperty({ description: "User e-mail" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: "User password" })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({ description: "User e-mail" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  // @ApiProperty({ description: "User password" })
  // @IsEmail()
  // @IsNotEmpty()
  // password!: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ description: "Reset token" })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ description: "New password", minLength: 6 })
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}
