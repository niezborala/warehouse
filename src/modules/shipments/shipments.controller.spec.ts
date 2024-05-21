import { Test, TestingModule } from '@nestjs/testing';

import { ShipmentsController } from "./shipments.controller";
import { ShipmentsService } from './shipments.service';
import { Shipment } from './shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

describe('ShipmentsController', () => {
    let shipmentsController: ShipmentsController;
    let shipmentsService: ShipmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ShipmentsController],
            providers: [
                {
                    provide: ShipmentsService,
                    useValue: {
                        createShipment: jest.fn(),
                        getShipments: jest.fn(),
                        getShipment: jest.fn(),
                        updateShipment: jest.fn(),
                        deleteShipment: jest.fn(),
                    },
                },
            ]
        }).compile();

        shipmentsController = module.get<ShipmentsController>(ShipmentsController);
        shipmentsService = module.get<ShipmentsService>(ShipmentsService);
    });

    describe('createShipment', () => {
        it('should create a shipment', async () => {
            const createShipmentDto = { companyName: 'Test Company' } as CreateShipmentDto;
            const expectedShipment = { id: '1', companyName: 'Test Company' } as Shipment;

            jest.spyOn(shipmentsService, 'createShipment').mockResolvedValue(expectedShipment);

            const result = await shipmentsController.createShipment(createShipmentDto);

            expect(result).toEqual(expectedShipment);
        });
    });

    describe('getShipments', () => {
        it('should return all shipments', async () => {
            const expectedShipments = [
                { id: '1', companyName: 'Test Company 1' },
            ] as Shipment[];
            const expectedPagination = paginateHelper(expectedShipments);

            jest.spyOn(shipmentsService, 'getShipments').mockResolvedValue(expectedPagination);

            const result = await shipmentsController.getShipments();

            expect(result.items).toEqual(expectedShipments);
        });
    });

    describe('getShipment', () => {
        it('should return a shipment', async () => {
            const expectedShipment = { id: '1', companyName: 'Test Company' } as Shipment;

            jest.spyOn(shipmentsService, 'getShipment').mockResolvedValue(expectedShipment);

            const result = await shipmentsController.getShipment('1');

            expect(result).toEqual(expectedShipment);
        });

        it('should throw an error if shipment does not exist', async () => {
            jest.spyOn(shipmentsService, 'getShipment').mockResolvedValue(null);

            await expect(shipmentsController.getShipment('1')).rejects.toThrow();
        });
    });

    describe('updateShipment', () => {
        it('should update a shipment', async () => {
            const updateShipmentDto = { companyName: 'Test Company' } as UpdateShipmentDto;
            const expectedShipment = { id: '1', companyName: 'Test Company' } as Shipment;

            jest.spyOn(shipmentsService, 'getShipment').mockResolvedValue(expectedShipment);
            jest.spyOn(shipmentsService, 'updateShipment').mockResolvedValue(expectedShipment);

            const result = await shipmentsController.updateShipment('1', updateShipmentDto);

            expect(result).toEqual(expectedShipment);
        });

        it('should throw an error if shipment does not exist', async () => {
            jest.spyOn(shipmentsService, 'getShipment').mockResolvedValue(null);

            await expect(shipmentsController.updateShipment('1', {} as UpdateShipmentDto)).rejects.toThrow();
        });
    });

    describe('deleteShipment', () => {
        it('should delete a shipment', async () => {
            const expectedShipment = { id: '1', companyName: 'Test Company' } as Shipment;

            jest.spyOn(shipmentsService, 'getShipment').mockResolvedValue(expectedShipment);
            jest.spyOn(shipmentsService, 'deleteShipment').mockResolvedValue();

            await shipmentsController.deleteShipment('1');
        });

        it('should throw an error if shipment does not exist', async () => {
            jest.spyOn(shipmentsService, 'getShipment').mockResolvedValue(null);

            await expect(shipmentsController.deleteShipment('1')).rejects.toThrow();
        });
    });
});

function paginateHelper(items) {
    return {
        items,
        meta: {
            totalItems: 1,
            itemCount: 1,
            itemsPerPage: 10,
            totalPages: 1,
            currentPage: 1
        },
        links: {
            first: "http://localhost:3000/api/v1/shipment?limit=10",
            previous: "",
            next: "",
            last: "http://localhost:3000/api/v1/shipment?page=1&limit=10"
        }
    };
}
