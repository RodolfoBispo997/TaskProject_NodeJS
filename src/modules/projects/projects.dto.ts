import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ProjectRequestDTO {
  @ApiProperty({
    description: "Project name",
  })
  @IsString()
  @IsNotEmpty()
  //variavel
  name!: string;

  @ApiProperty({
    description: "Project description",
    required: false,
  })
  @IsString()
  //variavel
  description?: string;
}

export class ProjectListItemDTO {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() description!: string;
  @ApiProperty({ format: "date-time" }) createdAt!: string;
  @ApiProperty({ format: "date-time" }) updatedAt!: string;
}
