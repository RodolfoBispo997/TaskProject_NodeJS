import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  CreateUserDTPo,
  UpdateUserDTO,
  UserFullDTIO,
  UserListItemDTO,
} from "./users.dto";
import { ApiResponse } from "@nestjs/swagger";

@Controller({
  version: "1",
  path: "users",
})
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiResponse({ type: [UserListItemDTO] })
  findByAll() {
    return this.userService.findByAll();
  }

  @Get(":userId")
  @ApiResponse({ type: UserFullDTIO })
  async findById(@Param("userId", ParseUUIDPipe) userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  @Get(":email")
  findByEmail(@Param("email") email: string) {
    return this.userService.findByEmail(email);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateUserDTPo) {
    return this.userService.create(data);
  }

  @Put(":userId")
  async update(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() data: UpdateUserDTO,
  ) {
    // const user = await this.userService.findById(userId);

    // if (!user) {
    //   throw new NotFoundException("User not found");
    // }
    return this.userService.update(userId, data);
  }

  @Delete(":userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.userService.remove(userId);
  }
}
