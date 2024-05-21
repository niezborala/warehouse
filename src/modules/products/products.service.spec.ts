import { Test, TestingModule } from '@nestjs/testing';

import { ProductsService } from "./products.service";
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
    let service: ProductsService;
    let repository: Repository<Product>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: 'ProductRepository',
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        repository = module.get<Repository<Product>>('ProductRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const createProductDto = { name: 'Test Product' } as CreateProductDto;
            const expectedProduct = { id: '1', name: 'Test Product' } as Product;

            jest.spyOn(repository, 'save').mockResolvedValue(expectedProduct as Product);

            const result = await service.createProduct(createProductDto);

            expect(result).toEqual(expectedProduct);
        });
    });

    describe('getProduct', () => {
        it('should return a product by id', async () => {
            const productId = '1';
            const expectedProduct = { id: '1', name: 'Test Product' } as Product;

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(expectedProduct as Product);

            const result = await service.getProduct(productId);

            expect(result).toEqual(expectedProduct);
        });
    });

    describe('getProductsByIds', () => {
        it('should return products by ids', async () => {
            const productIds = ['1', '2'];
            const expectedProducts = [
                { id: '1', name: 'Test Product 1' },
                { id: '2', name: 'Test Product 2' },
            ] as Product[];

            jest.spyOn(repository, 'find').mockResolvedValue(expectedProducts as Product[]);

            const result = await service.getProductsByIds(productIds);

            expect(result).toEqual(expectedProducts);
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            const productId = '1';
            const updateProductDto = { name: 'Updated Product' } as CreateProductDto;
            const expectedProduct = { id: '1', name: 'Updated Product' } as Product;

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(expectedProduct as Product);
            jest.spyOn(repository, 'update').mockResolvedValue({} as any);

            const result = await service.updateProduct(productId, updateProductDto);

            expect(result).toEqual(expectedProduct);
        });
    });
});
