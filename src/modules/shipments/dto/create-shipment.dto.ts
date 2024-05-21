import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsDateString, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class CreateShipmentItemDto {
    @ApiProperty()
    @IsUUID()
    productId: string;

    @ApiProperty()
    @IsNumber()
    quantity: number;
}

export class CreateShipmentDto {
    @ApiProperty()
    @IsString()
    companyName: string;

    @ApiProperty()
    @IsDateString()
    scheduledDate: Date;

    @ApiProperty({
        isArray: true,
        type: CreateShipmentItemDto
    })
    @IsArray()
    @ValidateNested({
        each: true
    })
    @ArrayMinSize(1)
    @Type(() => CreateShipmentItemDto)
    items: CreateShipmentItemDto[];
}
