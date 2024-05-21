import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Shipment } from "./shipment.entity";
import { Repository } from "typeorm";
import { CreateShipmentDto } from "./dto/create-shipment.dto";
import { ProductsService } from "../products/products.service";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import { Product } from "../products/product.entity";
import { ShipmentItem } from "./shipment-item.entity";

@Injectable()
export class ShipmentsService {
    constructor(
        @InjectRepository(Shipment)
        private shipmentRepository: Repository<Shipment>,
        @InjectRepository(ShipmentItem)
        private shipmentItemRepository: Repository<ShipmentItem>,
        private readonly productsService: ProductsService,
    ) { }

    async createShipment(createShipmentDto: CreateShipmentDto): Promise<Shipment> {
        const products: Product[] = await this.productsService
            .getProductsByIds(createShipmentDto.items.map(item => item.productId));

        if (products.length !== createShipmentDto.items.length) {
            throw new BadRequestException('Invalid product id');
        }

        // TODO: check if all products quantity is available

        const items = await this.shipmentItemRepository.save(createShipmentDto.items);

        return this.shipmentRepository.save({
            ...createShipmentDto,
            items,
        });
    }

    async getShipments(options: IPaginationOptions): Promise<Pagination<Shipment>> {
        const queryBuilder = this.shipmentRepository.createQueryBuilder('s');

        queryBuilder.orderBy('s.companyName', 'DESC');

        return paginate<Shipment>(queryBuilder, options);
    }

    async getShipment(shipmentId: string): Promise<Shipment> {
        return this.shipmentRepository.findOne({
            where: {
                id: shipmentId
            },
            relations: ['items']
        });
    }

    async updateShipment(shipmentId: string, updateShipmentDto: UpdateShipmentDto): Promise<Shipment> {
        const products = await this.productsService
            .getProductsByIds(updateShipmentDto.items.map(item => item.productId));

        if (products.length !== updateShipmentDto.items.length) {
            throw new BadRequestException('Invalid product id');
        }

        // TODO: check if all products are available

        const items = await this.shipmentItemRepository.save(updateShipmentDto.items);

        await this.shipmentRepository.update({
            id: shipmentId
        }, {
            ...updateShipmentDto,
            items,
        });

        return this.shipmentRepository.findOne({
            where: {
                id: shipmentId
            },
            relations: ['items']
        });
    }

    async deleteShipment(shipmentId: string): Promise<void> {
        this.shipmentRepository.delete({
            id: shipmentId
        });
    }
}
