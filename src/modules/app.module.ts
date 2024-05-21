import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { Shipment } from './shipments/shipment.entity';
import { ShipmentItem } from './shipments/shipment-item.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [
                Product,
                Shipment,
                ShipmentItem,
            ],
            synchronize: process.env.NODE_ENV === 'development',
        }),
        ProductsModule,
        ShipmentsModule,
    ],
})
export class AppModule {
    constructor(private dataSource: DataSource) { }
}
