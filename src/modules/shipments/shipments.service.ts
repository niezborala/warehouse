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

        const areProductsAvailable = this.checkIfProductsAreAvailable(
            products,
            createShipmentDto.items
        );

        if (!areProductsAvailable) {
            throw new BadRequestException('Quantity of products is not enough');
        }

        const items = await this.shipmentItemRepository.save(createShipmentDto.items.map(item => ({
            ...item,
            product: products.find(product => product.id === item.productId)
        })));

        products.forEach(product => {
            const item = createShipmentDto.items.find(item => item.productId === product.id);

            product.quantity -= item.quantity;
        });

        await this.productsService.updateProducts(products);

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
            relations: ['items', 'items.product']
        });
    }

    async updateShipment(shipmentId: string, updateShipmentDto: UpdateShipmentDto): Promise<Shipment> {
        const currentShipment = await this.shipmentRepository.findOne({
            where: {
                id: shipmentId
            },
            relations: ['items', 'items.product']
        });
        const currentProducts = await this.productsService
            .getProductsByIds(currentShipment.items.map(item => item.product.id));

        const products = await this.productsService
            .getProductsByIds(updateShipmentDto.items.map(item => item.productId));

        if (products.length !== updateShipmentDto.items.length) {
            throw new BadRequestException('Invalid product id');
        }

        // Return the quantity of products to the previous state
        currentProducts.forEach(product => {
            const item = currentShipment.items.find(item => item.product.id === product.id);

            product.quantity += item.quantity;
        });

        const areProductsAvailable = this.checkIfProductsAreAvailable(
            products,
            updateShipmentDto.items
        );

        if (!areProductsAvailable) {
            // Return the quantity of products to the previous state if the quantity of products is not enough
            currentProducts.forEach(product => {
                const item = currentShipment.items.find(item => item.product.id === product.id);

                product.quantity -= item.quantity;
            });

            throw new BadRequestException('Quantity of products is not enough');
        }

        const items = await this.shipmentItemRepository.save(updateShipmentDto.items);

        products.forEach(product => {
            const item = updateShipmentDto.items.find(item => item.productId === product.id);

            product.quantity -= item.quantity;
        });

        await this.productsService.updateProducts(products);

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

    checkIfProductsAreAvailable(products: Product[], items: {
        productId: string;
        quantity: number;
    }[]): boolean {
        if (products.length !== items.length) {
            return false;
        }

        return products.every(product => {
            const item = items.find(item => item.productId === product.id);

            return product.quantity >= item.quantity;
        });
    }
}
