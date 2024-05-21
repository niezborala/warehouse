import { ApiProperty } from "@nestjs/swagger";
import { ShipmentsStatus } from "../shipments.interfaces";
import { CreateShipmentDto } from "./create-shipment.dto";
import { IsEnum } from "class-validator";

export class UpdateShipmentDto extends CreateShipmentDto {
    @ApiProperty()
    @IsEnum(ShipmentsStatus)
    status: ShipmentsStatus;
}
