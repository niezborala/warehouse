import { Test, TestingModule } from '@nestjs/testing';
import { Shipment } from './shipment.entity';
import { Repository } from 'typeorm';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentItem } from './shipment-item.entity';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/product.entity';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

describe('ShipmentsService', () => {
    let shipmentsService: ShipmentsService;
    let productsService: ProductsService;
    let productRepository: Repository<Product>;
    let shipmentRepository: Repository<Shipment>;
    let shipmentItemRepository: Repository<ShipmentItem>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: 'ProductRepository',
                    useClass: Repository,
                },
                ShipmentsService,
                {
                    provide: 'ShipmentItemRepository',
                    useClass: Repository,
                },
                ProductsService,
                {
                    provide: 'ShipmentRepository',
                    useClass: Repository,
                },
            ],
        }).compile();

        productRepository = module.get<Repository<Product>>('ProductRepository');
        shipmentsService = module.get<ShipmentsService>(ShipmentsService);
        productsService = module.get<ProductsService>(ProductsService);
        shipmentItemRepository = module.get<Repository<ShipmentItem>>('ShipmentItemRepository');
        shipmentRepository = module.get<Repository<Shipment>>('ShipmentRepository');
    });

    it('should be defined', () => {
        expect(shipmentsService).toBeDefined();
    });

    describe('createShipment', () => {
        it('should create a shipment', async () => {
            const createShipmentDto = {
                companyName: 'Test Company',
                items: [
                    {
                        productId: '1',
                        quantity: 1,
                    },
                ],
            } as CreateShipmentDto;
            const expectedShipment = { id: '1', companyName: 'Test Company' } as Shipment;

            jest.spyOn(productsService, 'getProductsByIds').mockResolvedValue([{
                id: '1',
                quantity: 1,
            } as Product]);
            // @ts-ignore
            jest.spyOn(shipmentItemRepository, 'save').mockResolvedValue(createShipmentDto.items as ShipmentItem[]);
            jest.spyOn(productsService, 'updateProducts').mockResolvedValue([]);
            jest.spyOn(shipmentRepository, 'save').mockResolvedValue(expectedShipment as Shipment);

            const result = await shipmentsService.createShipment(createShipmentDto);

            expect(result).toEqual(expectedShipment);
        });

        it('should throw an error if product id is invalid', async () => {
            const createShipmentDto = {
                companyName: 'Test Company',
                items: [
                    {
                        productId: '1',
                        quantity: 1,
                    },
                ],
            } as CreateShipmentDto;

            jest.spyOn(productsService, 'getProductsByIds').mockResolvedValue([]);

            await expect(shipmentsService.createShipment(createShipmentDto)).rejects.toThrow(
                'Invalid product id',
            );
        });

        it('should throw an error if quantity of products is not enough', async () => {
            const createShipmentDto = {
                companyName: 'Test Company',
                items: [
                    {
                        productId: '1',
                        quantity: 1,
                    },
                ],
            } as CreateShipmentDto;

            jest.spyOn(productsService, 'getProductsByIds').mockResolvedValue([{
                id: '1',
                quantity: 0,
            } as Product]);

            await expect(shipmentsService.createShipment(createShipmentDto)).rejects.toThrow(
                'Quantity of products is not enough',
            );
        });
    });

    describe('getShipment', () => {
        it('should return a shipment by id', async () => {
            const shipmentId = '1';
            const expectedShipment = { id: '1', companyName: 'Test Company' } as Shipment;

            jest.spyOn(shipmentRepository, 'findOne').mockResolvedValue(expectedShipment as Shipment);

            const result = await shipmentsService.getShipment(shipmentId);

            expect(result).toEqual(expectedShipment);
        });
    });

    describe('updateShipment', () => {
        it('should update a shipment', async () => {
            const shipmentId = '1';
            const updateShipmentDto = {
                companyName: 'Test Company',
                items: [
                    {
                        productId: '1',
                        quantity: 1,
                    },
                ],
            } as UpdateShipmentDto;
            const expectedShipment = {
                id: '1',
                companyName: 'Test Company',
                items: [
                    {
                        product: { id: '1' },
                        quantity: 1,
                    },
                ],
            } as unknown as Shipment;

            jest.spyOn(shipmentRepository, 'findOne').mockResolvedValue(expectedShipment as Shipment);
            jest.spyOn(productsService, 'getProductsByIds').mockResolvedValue([{
                id: '1',
                quantity: 1,
            } as Product]);
            // @ts-ignore
            jest.spyOn(shipmentItemRepository, 'save').mockResolvedValue(updateShipmentDto.items as ShipmentItem[]);
            jest.spyOn(productsService, 'updateProducts').mockResolvedValue([]);
            jest.spyOn(shipmentRepository, 'update').mockResolvedValue({} as any);
            jest.spyOn(shipmentRepository, 'save').mockResolvedValue(expectedShipment as Shipment);

            const result = await shipmentsService.updateShipment(shipmentId, updateShipmentDto);

            expect(result).toEqual(expectedShipment);
        });

        it('should throw an error if shipment does not exist', async () => {
            jest.spyOn(shipmentRepository, 'findOne').mockResolvedValue(null);

            await expect(shipmentsService.updateShipment('1', {} as UpdateShipmentDto)).rejects.toThrow();
        });
    });

    describe('deleteShipment', () => {
        it('should delete a shipment', async () => {
            const shipmentId = '1';
            const expectedShipment = { id: '1', companyName: 'Test Company' } as Shipment;

            jest.spyOn(shipmentRepository, 'findOne').mockResolvedValue(expectedShipment as Shipment);
            jest.spyOn(shipmentRepository, 'delete').mockResolvedValue({} as any);

            await shipmentsService.deleteShipment(shipmentId);

            expect(shipmentRepository.delete).toHaveBeenCalledWith({ id: shipmentId });
        });

        it('should throw an error if shipment does not exist', async () => {
            jest.spyOn(shipmentRepository, 'findOne').mockResolvedValue(null);

            await expect(shipmentsService.deleteShipment('1')).rejects.toThrow();
        });
    });
});
