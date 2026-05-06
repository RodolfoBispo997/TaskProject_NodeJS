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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  CreateUserDTPo,
  UpdateUserDTO,
  UserFullDTIO,
  UserListItemDTO,
} from "./users.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth/jwt-auth.guard";
import { CloudinaryService } from "../../common/services/cloudinary/cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { RequestContextService } from "../../common/services/request-context/request-context.service";
import { ApiPaginatedResponse } from "../../common/swagger/api-paginated-response";
import { QueryPaginationDTO } from "../../common/dtos/query-pagination.dto";

@Controller({
  version: "1",
  path: "users",
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("jwt")
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Get()
  @ApiPaginatedResponse(UserListItemDTO)
  findByAll(@Query() query?: QueryPaginationDTO) {
    return this.userService.findByAll(query);
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

  @Post("/avatar")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User avatar uploaded successfully",
    type: UserListItemDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid data",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("file"))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const user = this.requestContext.getUser();

    const response = await this.cloudinaryService.upload(file, user.id);

    await this.userService.update(user.id, {
      ...user,
      avatar: response.url,
    });

    return this.userService.findById(user.id);
  }
}
