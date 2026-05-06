import { ApiProperty } from "@nestjs/swagger";
import { CollaboratorRole } from "../../generated/prisma";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddCollaboratorsDTO {
  @ApiProperty({ description: "User ID to add as collaborator" })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({
    description: "Collaborator Role",
    enum: CollaboratorRole,
    default: CollaboratorRole.EDITOR,
    required: false,
  })
  @IsString()
  @IsEnum(CollaboratorRole)
  @IsOptional()
  role?: CollaboratorRole = CollaboratorRole.EDITOR;
}

export class UpdateCollaboratorDTO {
  @ApiProperty({ description: "New Collaborator role", enum: CollaboratorRole })
  @IsEnum(CollaboratorRole)
  @IsNotEmpty()
  role!: CollaboratorRole;
}

class CollaboratorUserDTO {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() email!: string;
  @ApiProperty({ nullable: true }) avatar!: string | null;
}

export class CollaboratorListItemDTO {
  @ApiProperty() id!: string;
  @ApiProperty({ enum: CollaboratorRole }) role!: CollaboratorRole;
  @ApiProperty() projectId!: string;
  @ApiProperty() userId!: string;
  @ApiProperty({ format: "date-time" }) createdAt!: Date;

  @ApiProperty({ type: CollaboratorUserDTO })
  user!: CollaboratorUserDTO;
}
