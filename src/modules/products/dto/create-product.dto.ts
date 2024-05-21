import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    @Min(0.01, {
        message: 'Price must be greater than 0',
    })
    readonly price: number;

    @ApiProperty()
    @IsNumber(
        {
            allowInfinity: false,
            allowNaN: false,
            maxDecimalPlaces: 0,
        }
    )
    @Min(1, {
        message: 'Quantity must be greater than 0',
    })
    readonly quantity: number;
}