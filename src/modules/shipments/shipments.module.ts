import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShipmentsController } from "./shipments.controller";
import { ShipmentsService } from "./shipments.service";
import { Shipment } from "./shipment.entity";
import { ProductsModule } from "../products/products.module";
import { ShipmentItem } from "./shipment-item.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Shipment]),
        TypeOrmModule.forFeature([ShipmentItem]),
        ProductsModule,
    ],
    controllers: [ShipmentsController],
    providers: [ShipmentsService],
})
export class ShipmentsModule { }
